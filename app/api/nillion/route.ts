import { Keypair, NilauthClient, PayerBuilder } from '@nillion/nuc'
import { ReadBuilderProfileResponse, SecretVaultBuilderClient } from '@nillion/secretvaults'
import { NextResponse } from 'next/server'

const testnetNillionClusterConfig = {
  chain: 'http://rpc.testnet.nilchain-rpc-proxy.nilogy.xyz',
  auth: 'https://nilauth.sandbox.app-cluster.sandbox.nilogy.xyz',
  dbs: 'https://nildb-stg-n1.nillion.network,https://nildb-stg-n2.nillion.network,https://nildb-stg-n3.nillion.network'.split(
    ',',
  ),
}

/**
 * Initialize SecretVault wrapper with NUC credentials
 */
const initNillionAuth = async (builderPrivateKey: string, clusterConfig = testnetNillionClusterConfig) => {
  // Step 1: Create keypairs for builder and user
  const builderKeypair = Keypair.from(builderPrivateKey) // Use your funded key
  const userKeypair = Keypair.generate() // Generate random user

  const builderDid = builderKeypair.toDid().toString()
  const userDid = userKeypair.toDid().toString()

  console.log('Builder DID: %s, User DID: %s,', builderDid, userDid)

  // Step 2: Create payer and nilauth client
  const payer = await new PayerBuilder().keypair(builderKeypair).chainUrl(clusterConfig.chain).build()

  const nilauthClient = await NilauthClient.from(clusterConfig.auth, payer)

  return {
    nilauthClient,
    payer,
    builderKeypair,
    userKeypair,
  }
}

const registerBuilder = async (
  builder: SecretVaultBuilderClient,
  builderDid: string,
): Promise<ReadBuilderProfileResponse> => {
  // Step 4: Register builder (handle existing registration)
  try {
    const existingProfile = await builder.readProfile()
    console.log('Builder already registered:', existingProfile.data.name)
    return existingProfile
  } catch (profileError) {
    try {
      const response = await builder.register({
        //@ts-ignore
        did: builderDid,
        name: 'Welshare Wallet Builder',
      })
      console.debug('Builder registered successfully', response)
      const existingProfile = await builder.readProfile()
      return existingProfile
    } catch (registerError: any) {
      // Handle duplicate key errors gracefully
      if (registerError.message.includes('duplicate key')) {
        console.debug('Builder already registered (duplicate key)')
        //todo: this should not happen...
        throw registerError
      } else {
        throw registerError
      }
    }
  }
}

const makeNillionBuilder = async () => {
  const { builderKeypair } = await initNillionAuth(process.env.NIL_BUILDER_PRIVATE_KEY as string)

  //Step 3: Create builder client
  const builder = await SecretVaultBuilderClient.from({
    keypair: builderKeypair,
    urls: testnetNillionClusterConfig,
  })

  // Refresh token using existing subscription
  await builder.refreshRootToken()

  const builderResponse = await registerBuilder(builder, builderKeypair.toDid().toString())

  return {
    builder,
    resources: {
      name: builderResponse.data.name,
      collections: builderResponse.data.collections,
      queries: builderResponse.data.queries,
    },
  }
}

export async function GET() {
  const { builder } = await makeNillionBuilder()
  const collections = await builder.readCollections()
  console.log('collections', collections)

  return NextResponse.json({ message: 'success', foo: 'bar' }, { status: 200 })
}
