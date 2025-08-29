// =============================================================================
// Webpack Memory Optimization Configuration for cPanel
// =============================================================================
// This configuration optimizes webpack to work within 4GB memory constraints
// by implementing aggressive memory management strategies.
//
// Author: QioGems Development Team
// Version: 1.0
// =============================================================================

const path = require('path')

/**
 * Memory-optimized webpack configuration for cPanel hosting
 * Reduces memory usage through chunking, caching, and optimization strategies
 */
function createMemoryOptimizedConfig(config, { dev, isServer, buildId }) {
  // Memory optimization settings
  const memoryOptimizations = {
    // Reduce memory usage by limiting concurrent processing
    parallelism: 1,
    
    // Optimize module resolution
    resolve: {
      ...config.resolve,
      // Reduce filesystem calls
      symlinks: false,
      // Cache module resolution
      cache: true,
      // Limit module search paths
      modules: ['node_modules'],
    },
    
    // Optimize module rules
    module: {
      ...config.module,
      // Disable unnecessary parsing
      noParse: /node_modules\/(lodash|moment|jquery)/,
    },
    
    // Memory-efficient optimization settings
    optimization: {
      ...config.optimization,
      
      // Minimize memory usage during minification
      minimize: !dev,
      minimizer: dev ? [] : [
        // Use terser with memory optimization
        new (require('terser-webpack-plugin'))({
          parallel: false, // Disable parallel processing to save memory
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true,
              pure_funcs: ['console.log', 'console.info'],
            },
            mangle: {
              safari10: true,
            },
          },
        }),
      ],
      
      // Aggressive code splitting for memory efficiency
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 100000, // 100KB max chunk size
        minChunks: 1,
        maxAsyncRequests: 10,
        maxInitialRequests: 10,
        automaticNameDelimiter: '~',
        cacheGroups: {
          // Vendor chunks
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
            maxSize: 150000, // 150KB for vendor chunks
            enforce: true,
          },
          
          // React chunks
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
            maxSize: 100000,
            enforce: true,
          },
          
          // Next.js chunks
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next',
            priority: 15,
            chunks: 'all',
            maxSize: 200000,
            enforce: true,
          },
          
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            chunks: 'all',
            maxSize: 80000,
            reuseExistingChunk: true,
          },
          
          // Default chunks
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
            maxSize: 50000,
          },
        },
      },
      
      // Runtime chunk optimization
      runtimeChunk: {
        name: 'runtime',
      },
      
      // Module concatenation for smaller bundles
      concatenateModules: !dev,
      
      // Remove empty chunks
      removeEmptyChunks: true,
      
      // Merge duplicate chunks
      mergeDuplicateChunks: true,
      
      // Flag dependent modules
      flagIncludedChunks: !dev,
    },
    
    // Performance optimizations
    performance: {
      hints: dev ? false : 'warning',
      maxAssetSize: 200000, // 200KB
      maxEntrypointSize: 300000, // 300KB
    },
    
    // Cache configuration for faster rebuilds
    cache: {
      type: 'filesystem',
      cacheDirectory: path.resolve('.next/cache/webpack'),
      maxMemoryGenerations: 1, // Limit memory generations
      memoryCacheUnaffected: true,
      buildDependencies: {
        config: [__filename],
      },
    },
    
    // Reduce stats output to save memory
    stats: {
      preset: 'minimal',
      moduleTrace: false,
      errorDetails: false,
    },
    
    // Snapshot options for memory efficiency
    snapshot: {
      managedPaths: [path.resolve('node_modules')],
      immutablePaths: [],
      buildDependencies: {
        hash: true,
        timestamp: true,
      },
      module: {
        timestamp: true,
        hash: true,
      },
      resolve: {
        timestamp: true,
        hash: true,
      },
      resolveBuildDependencies: {
        timestamp: true,
        hash: true,
      },
    },
  }
  
  // Apply memory optimizations to config
  Object.assign(config, memoryOptimizations)
  
  // Additional plugins for memory optimization
  const memoryPlugins = []
  
  // Limit chunk count to reduce memory usage
  if (!dev) {
    const webpack = require('webpack')
    
    memoryPlugins.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 20, // Limit total chunks
      })
    )
    
    // Progress plugin with memory monitoring
    memoryPlugins.push(
      new webpack.ProgressPlugin({
        activeModules: false,
        entries: true,
        modules: false,
        modulesCount: 100,
        profile: false,
        dependencies: false,
        dependenciesCount: 1000,
        percentBy: 'entries',
      })
    )
  }
  
  // Add memory plugins to config
  config.plugins = [...(config.plugins || []), ...memoryPlugins]
  
  // Environment-specific optimizations
  if (!dev) {
    // Production optimizations
    config.devtool = false // Disable source maps to save memory
    
    // Tree shaking optimization
    config.optimization.usedExports = true
    config.optimization.sideEffects = false
    
    // Module IDs optimization
    config.optimization.moduleIds = 'deterministic'
    config.optimization.chunkIds = 'deterministic'
  } else {
    // Development optimizations
    config.devtool = 'eval-cheap-module-source-map' // Faster, less memory
    
    // Faster incremental builds
    config.optimization.removeAvailableModules = false
    config.optimization.removeEmptyChunks = false
    config.optimization.splitChunks = false
  }
  
  // Memory monitoring (development only)
  if (dev && process.env.MONITOR_MEMORY === 'true') {
    const originalAfterEmit = config.plugins.find(p => p.constructor.name === 'AfterEmitPlugin')
    if (!originalAfterEmit) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.afterEmit.tap('MemoryMonitor', () => {
            const used = process.memoryUsage()
            console.log('\n📊 Memory Usage:')
            console.log(`   RSS: ${Math.round(used.rss / 1024 / 1024 * 100) / 100} MB`)
            console.log(`   Heap Total: ${Math.round(used.heapTotal / 1024 / 1024 * 100) / 100} MB`)
            console.log(`   Heap Used: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`)
            console.log(`   External: ${Math.round(used.external / 1024 / 1024 * 100) / 100} MB`)
          })
        }
      })
    }
  }
  
  return config
}

/**
 * Memory-optimized Next.js webpack configuration
 */
function nextWebpackConfig(config, options) {
  // Apply memory optimizations
  const optimizedConfig = createMemoryOptimizedConfig(config, options)
  
  // Additional Next.js specific optimizations
  if (!options.dev) {
    // Disable Next.js telemetry to save memory
    process.env.NEXT_TELEMETRY_DISABLED = '1'
    
    // Optimize bundle analyzer (if used)
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      optimizedConfig.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
          generateStatsFile: false, // Don't generate stats to save memory
        })
      )
    }
  }
  
  return optimizedConfig
}

module.exports = {
  createMemoryOptimizedConfig,
  nextWebpackConfig,
}

// Usage example:
// In your next.config.js:
// const { nextWebpackConfig } = require('./webpack.memory-optimized')
// 
// module.exports = {
//   webpack: nextWebpackConfig,
//   // ... other config
// }