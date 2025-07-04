
import { Keypair } from '@nillion/nuc';
import { SecretVaultBuilderClient } from '@nillion/secretvaults';

export type AppConfig = {
    NILCHAIN_URL: string;
    NILAUTH_URL: string;
    NILDB_NODES: string[];
    NIL_PAYER_PRIVATE_KEY: string;
    NIL_BUILDER_PRIVATE_KEY: string;
    NIL_BUILDER_COLLECTION_ID: string;
};

const config: AppConfig = {
    NILCHAIN_URL:
        process.env.NILCHAIN_URL ||
        'http://rpc.testnet.nilchain-rpc-proxy.nilogy.xyz',
    NILAUTH_URL:
        process.env.NILAUTH_URL ||
        'https://nilauth.sandbox.app-cluster.sandbox.nilogy.xyz',
    NILDB_NODES: process.env.NILDB_NODES
        ? process.env.NILDB_NODES.split(',')
        : [
                'https://nildb-stg-n1.nillion.network',
                'https://nildb-stg-n2.nillion.network',
                'https://nildb-stg-n3.nillion.network',
          ],
    NIL_PAYER_PRIVATE_KEY: process.env.PAYER_PRIVATE_KEY!,
    NIL_BUILDER_PRIVATE_KEY: process.env.NIL_BUILDER_PRIVATE_KEY!,
    NIL_BUILDER_COLLECTION_ID: "967334c9-97fa-443b-bacf-919cfbf23da0"
};

const init = async () => {
  // Test
  const builderKeypair = Keypair.from(config.NIL_BUILDER_PRIVATE_KEY!);
  await SecretVaultBuilderClient.from({
    keypair: builderKeypair,
    urls: {
        chain: config.NILCHAIN_URL,
        auth: config.NILAUTH_URL,
        dbs: config.NILDB_NODES,
    },
  });
}

init()