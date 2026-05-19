const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

function patchFile(filePath, replacers, marker) {
  const absPath = path.join(rootDir, filePath);
  let source = fs.readFileSync(absPath, 'utf8');

  if (source.includes(marker)) {
    return;
  }

  let nextSource = source;
  for (const [search, replacement] of replacers) {
    if (!nextSource.includes(search)) {
      throw new Error(`Expected to find patch target in ${filePath}`);
    }
    nextSource = nextSource.replace(search, replacement);
  }

  fs.writeFileSync(absPath, nextSource, 'utf8');
}

const buildContextPatch = [
  [
    '            _buildcontext.NextBuildContext.config = config;\n',
    '            const buildContextConfig = {\n' +
      '                ...config,\n' +
      '                generateBuildId: null\n' +
      '            };\n' +
      '            _buildcontext.NextBuildContext.config = buildContextConfig;\n',
  ],
];

const exportWorkerPatch = [
  [
    "    const { i18n, images: { loader = 'default', unoptimized } } = nextConfig;\n",
    "    const workerNextConfig = {\n" +
      '        ...nextConfig\n' +
      '    };\n' +
      '    for (const key of [\n' +
      "        'generateBuildId',\n" +
      "        'exportPathMap',\n" +
      "        'rewrites',\n" +
      "        'redirects',\n" +
      "        'headers'\n" +
      '    ]){\n' +
      '        if (typeof workerNextConfig[key] === \'function\') {\n' +
      '            workerNextConfig[key] = null;\n' +
      '        }\n' +
      '    }\n' +
      '    const workerOptions = {\n' +
      '        ...options,\n' +
      '        nextConfig: workerNextConfig\n' +
      '    };\n' +
      "    const { i18n, images: { loader = 'default', unoptimized } } = nextConfig;\n",
  ],
  [
    "        return (await Promise.all(batches.map(async (batch)=>worker.exportPages({\n" +
      '                buildId,\n' +
      '                exportPaths: batch,\n' +
      '                parentSpanId: span.getId(),\n' +
      '                pagesDataDir,\n' +
      '                renderOpts,\n' +
      '                options,\n' +
      '                dir,\n' +
      '                distDir,\n' +
      '                outDir,\n' +
      '                nextConfig,\n' +
      '                cacheHandler: nextConfig.cacheHandler,\n' +
      '                cacheMaxMemorySize: nextConfig.cacheMaxMemorySize,\n' +
      '                fetchCache: true,\n' +
      '                fetchCacheKeyPrefix: nextConfig.experimental.fetchCacheKeyPrefix,\n' +
      '                renderResumeDataCachesByPage\n' +
      '            })))).flat();\n',
    "        return (await Promise.all(batches.map(async (batch)=>worker.exportPages({\n" +
      '                buildId,\n' +
      '                exportPaths: batch,\n' +
      '                parentSpanId: span.getId(),\n' +
      '                pagesDataDir,\n' +
      '                renderOpts,\n' +
      '                options: workerOptions,\n' +
      '                dir,\n' +
      '                distDir,\n' +
      '                outDir,\n' +
      '                nextConfig: workerNextConfig,\n' +
      '                cacheHandler: nextConfig.cacheHandler,\n' +
      '                cacheMaxMemorySize: nextConfig.cacheMaxMemorySize,\n' +
      '                fetchCache: true,\n' +
      '                fetchCacheKeyPrefix: nextConfig.experimental.fetchCacheKeyPrefix,\n' +
      '                renderResumeDataCachesByPage\n' +
      '            })))).flat();\n',
  ],
  [
    '            worker = createStaticWorker(nextConfig, {\n',
    '            worker = createStaticWorker(workerNextConfig, {\n',
  ],
  [
    '            worker = (0, _build.createStaticWorker)(nextConfig, {\n',
    '            worker = (0, _build.createStaticWorker)(workerNextConfig, {\n',
  ],
];

const filesToPatch = [
  {
    filePath: 'node_modules/next/dist/build/index.js',
    marker: 'generateBuildId: null',
    replacers: buildContextPatch,
  },
  {
    filePath: 'node_modules/next/dist/esm/build/index.js',
    marker: 'generateBuildId: null',
    replacers: buildContextPatch,
  },
  {
    filePath: 'node_modules/next/dist/export/index.js',
    marker: 'workerNextConfig',
    replacers: exportWorkerPatch,
  },
  {
    filePath: 'node_modules/next/dist/esm/export/index.js',
    marker: 'workerNextConfig',
    replacers: exportWorkerPatch,
  },
];

for (const entry of filesToPatch) {
  patchFile(entry.filePath, entry.replacers, entry.marker);
}

console.log('Applied Next worker compatibility patch.');
