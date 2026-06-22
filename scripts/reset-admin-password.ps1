$sk = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnZmlzem1ueGt0ZXRuYWh1ZnBtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjEzNzEyOSwiZXhwIjoyMDk3NzEzMTI5fQ.AjaHd80swTNZMKauJPIEarLAu0UgqXtfRMT95tP8mys"
$base = "https://rgfiszmnxktetnahufpm.supabase.co"

$headers = @{
    "apikey"        = $sk
    "Authorization" = "Bearer $sk"
    "Content-Type"  = "application/json"
}

# Step 1: Get users list to find the admin user ID
Write-Host "Fetching users list..."
$response = Invoke-RestMethod -Method GET -Uri "$base/auth/v1/admin/users" -Headers $headers -TimeoutSec 30
$adminUser = $response.users | Where-Object { $_.email -eq "info@black4me.com" }

if (-not $adminUser) {
    Write-Host "User not found! Creating..."
    $body = @{
        email         = "info@black4me.com"
        password      = "Stylesg1995@@"
        email_confirm = $true
    } | ConvertTo-Json
    $adminUser = Invoke-RestMethod -Method POST -Uri "$base/auth/v1/admin/users" -Headers $headers -Body $body -TimeoutSec 30
    Write-Host "Created user: $($adminUser.id)"
} else {
    Write-Host "Found user: $($adminUser.id) - Email: $($adminUser.email)"
    
    # Step 2: Update password
    $userId = $adminUser.id
    $body = @{
        password = "Stylesg1995@@"
    } | ConvertTo-Json
    
    Write-Host "Resetting password for user ID: $userId"
    $result = Invoke-RestMethod -Method PUT -Uri "$base/auth/v1/admin/users/$userId" -Headers $headers -Body $body -TimeoutSec 30
    Write-Host "Password reset SUCCESS for: $($result.email)"
}
