param(
    [string]$Username = 'Hongke Ouyang',
    [string]$OutputDirectory
)
$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($Username) -or $Username.IndexOfAny([IO.Path]::GetInvalidFileNameChars()) -ge 0) {
    throw 'Username must be a valid filename component.'
}
if (-not $OutputDirectory) {
    $OutputDirectory = Join-Path $projectRoot ('submission\A2-' + (Get-Date -Format 'yyyyMMdd-HHmmss'))
}
$outputRoot = [IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $outputRoot) { throw 'Choose a new output directory; existing output is never overwritten.' }
$groups = [ordered]@{
    clientside = @(
        'clientside/index.html','clientside/search.html','clientside/detail.html',
        'clientside/README.md','clientside/assets/styles.css','clientside/assets/site.js',
        'clientside/assets/home.js','clientside/assets/search.js','clientside/assets/detail.js'
    )
    api = @(
        'README.md','api/README.md','api/app.js','api/server.js','api/event_db.js',
        'api/validation.js','api/package.json','api/package-lock.json','api/.env.example',
        'api/test/api.test.js','api/test/validation.test.js','api/scripts/browser-check.js',
        'database/charityevents_db.sql','database/verify.sql','database/README.md',
        'docs/README.md','docs/local-setup.md','docs/api-reference.md','docs/image-sources.md',
        'docs/a2-verification.md','docs/a2-a3-module-plan.md','docs/a2-delivery-checklist.md',
        'docs/a2-video-checklist.md','scripts/package-a2.ps1'
    )
}
foreach ($files in $groups.Values) {
    foreach ($relative in $files) {
        if (-not (Test-Path -LiteralPath (Join-Path $projectRoot $relative) -PathType Leaf)) {
            throw "Missing source file: $relative"
        }
    }
}
Add-Type -AssemblyName System.IO.Compression.FileSystem
New-Item -ItemType Directory -Path $outputRoot | Out-Null
$stageRoot = Join-Path $projectRoot ('.runtime\packaging\' + [guid]::NewGuid().ToString('N'))
$packages = @()
foreach ($name in $groups.Keys) {
    $stage = Join-Path $stageRoot $name
    New-Item -ItemType Directory -Path $stage -Force | Out-Null
    $files = @()
    foreach ($relative in $groups[$name]) {
        $source = Join-Path $projectRoot $relative
        $target = Join-Path $stage $relative
        New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
        Copy-Item -LiteralPath $source -Destination $target
        $files += [ordered]@{ path = $relative; sha256 = (Get-FileHash -LiteralPath $source -Algorithm SHA256).Hash }
    }
    $zipName = $Username + 'A2-' + $name + '.zip'
    $zipPath = Join-Path $outputRoot $zipName
    [IO.Compression.ZipFile]::CreateFromDirectory($stage, $zipPath)
    $archive = [IO.Compression.ZipFile]::OpenRead($zipPath)
    try {
        $entries = @($archive.Entries | Where-Object { $_.Name })
        if ($entries.Count -ne $files.Count) { throw "Unexpected archive entry count: $zipName" }
        foreach ($file in $files) {
            $entry = $entries | Where-Object { $_.FullName.Replace('\','/') -eq $file.path }
            if (@($entry).Count -ne 1) { throw "Missing or duplicate ZIP entry: $($file.path)" }
            $stream = $entry.Open()
            $hasher = [Security.Cryptography.SHA256]::Create()
            try { $actual = [BitConverter]::ToString($hasher.ComputeHash($stream)).Replace('-','') }
            finally { $hasher.Dispose(); $stream.Dispose() }
            if ($actual -ne $file.sha256) { throw "ZIP content differs: $($file.path)" }
        }
    } finally { $archive.Dispose() }
    $packages += [ordered]@{ name = $zipName; sha256 = (Get-FileHash -LiteralPath $zipPath -Algorithm SHA256).Hash; files = $files }
}
$sqlPath = Join-Path $outputRoot 'charityevents_db.sql'
Copy-Item -LiteralPath (Join-Path $projectRoot 'database\charityevents_db.sql') -Destination $sqlPath
$manifest = [ordered]@{
    createdAt = (Get-Date).ToString('o'); username = $Username
    port = 3101; packages = $packages
    sql = [ordered]@{ name = 'charityevents_db.sql'; sha256 = (Get-FileHash -LiteralPath $sqlPath -Algorithm SHA256).Hash }
    exclusions = @('.env','node_modules','.git','.runtime','report','video')
}
$utf8 = New-Object System.Text.UTF8Encoding($false)
[IO.File]::WriteAllText((Join-Path $outputRoot 'MANIFEST.json'), ($manifest | ConvertTo-Json -Depth 10) + "`n", $utf8)
$checksums = @($packages | ForEach-Object { $_.sha256 + '  ' + $_.name })
$checksums += $manifest.sql.sha256 + '  charityevents_db.sql'
[IO.File]::WriteAllText((Join-Path $outputRoot 'SHA256SUMS.txt'), ($checksums -join "`n") + "`n", $utf8)
Write-Output "Packages created and entry hashes verified: $outputRoot"
