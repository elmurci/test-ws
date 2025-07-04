import type { NextConfig } from 'next'
import webpack from 'webpack'

const nextConfig: NextConfig = {
  webpack: (config: any, { isServer }) => {
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/node:/, (resource: any) => {
        resource.request = resource.request.replace(/^node:/, '')
      }),
    )

    // Add externals for server-side packages that should not be bundled
    config.externals.push('pino', 'pino-pretty')
    //config.externals.push({ 'thread-stream': 'commonjs thread-stream', pino: 'commonjs pino' });

    return config
  },
}

export default nextConfig
