param(
    [int]$Port = 8080,
    [string]$RootDir = ""
)

if ([string]::IsNullOrWhiteSpace($RootDir)) {
    $scriptDir = $PSScriptRoot
    if (-not $scriptDir) { $scriptDir = (Get-Location).Path }
    
    if (Test-Path (Join-Path $scriptDir "frontend")) {
        $RootDir = (Resolve-Path (Join-Path $scriptDir "frontend")).Path
    } elseif (Test-Path (Join-Path $scriptDir "..\frontend")) {
        $RootDir = (Resolve-Path (Join-Path $scriptDir "..\frontend")).Path
    } else {
        $RootDir = $scriptDir
    }
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Green
    Write-Host " GeoSetu-India Web Platform is live and running!" -ForegroundColor Cyan
    Write-Host " URL: http://localhost:$Port/" -ForegroundColor Yellow
    Write-Host " Serving Frontend From: $RootDir" -ForegroundColor Gray
    Write-Host " Press Ctrl+C in this console window to stop the server." -ForegroundColor DarkGray
    Write-Host "==========================================================" -ForegroundColor Green
} catch {
    Write-Error "Failed to start HTTP listener on port $Port. Error: $_"
    exit 1
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rawUrl = $request.Url.LocalPath
        if ($rawUrl -eq "/" -or [string]::IsNullOrWhiteSpace($rawUrl)) {
            $rawUrl = "/index.html"
        }

        # sanitize path to prevent directory traversal
        $relative = $rawUrl.TrimStart("/").Replace("/", [System.IO.Path]::DirectorySeparatorChar)
        $filePath = [System.IO.Path]::Combine($RootDir, $relative)

        if ([System.IO.File]::Exists($filePath)) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = $mimeTypes[$ext]
            if (-not $mime) { $mime = "application/octet-stream" }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Cache-Control", "no-cache")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $notFoundMsg = [System.Text.Encoding]::UTF8.GetBytes("404 - File Not Found: $rawUrl")
            $response.StatusCode = 404
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $notFoundMsg.Length
            $response.OutputStream.Write($notFoundMsg, 0, $notFoundMsg.Length)
        }
        $response.Close()
    } catch {
        # Catch and continue on client disconnects or minor IO interruptions
    }
}
