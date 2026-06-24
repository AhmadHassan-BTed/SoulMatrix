$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    $rootDir = Split-Path -Parent $PSScriptRoot
    Write-Host "===================================================" -ForegroundColor Cyan
    Write-Host "  PowerShell Local Server Running on port $port" -ForegroundColor Cyan
    Write-Host "  Serving files from: $rootDir" -ForegroundColor Cyan
    Write-Host "  Press Ctrl+C in this window to stop the server" -ForegroundColor Cyan
    Write-Host "===================================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Open the browser automatically
    Start-Process "http://localhost:$port/src/soul_matrix.html"
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ($urlPath -eq "") {
            $urlPath = "src/soul_matrix.html"
        }
        $localPath = Join-Path $rootDir $urlPath
        
        if (Test-Path $localPath -PathType Container) {
            $localPath = Join-Path $localPath "src/soul_matrix.html"
        }
        
        if (Test-Path $localPath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $contentType = switch ($ext) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css; charset=utf-8" }
                ".js" { "application/javascript; charset=utf-8" }
                ".csv" { "text/csv; charset=utf-8" }
                ".png" { "image/png" }
                ".jpg" { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif" { "image/gif" }
                ".svg" { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        else {
            $response.StatusCode = 404
            $response.StatusDescription = "Not Found"
        }
        $response.Close()
    }
}
catch {
    Write-Error $_
}
finally {
    $listener.Stop()
}
