param (
  # Specifies a path to one or more locations. Unlike the Path parameter, the value of the LiteralPath parameter is
  # used exactly as it is typed. No characters are interpreted as wildcards. If the path includes escape characters,
  # enclose it in single quotation marks. Single quotation marks tell Windows PowerShell not to interpret any
  # characters as escape sequences.
  [Parameter(Mandatory=$true,
             Position=0,
             ParameterSetName="deploymentPath",
             ValueFromPipelineByPropertyName=$true,
             HelpMessage="Literal path to one or more locations.")]
  [Alias("Path")]
  [ValidateNotNullOrEmpty()]
  [string[]]
  $deploymentPaths,

  [switch]
  $noGitSync
)

$ErrorActionPreference = "stop"
Import-Module Posh-SSH

# remote names
$remoteComputerName = "cs.wheatoncollege.edu"

# set the path of the file to store user name and password
$usernamePath = "$PSScriptRoot/username.secret"
$passwordPath = "$PSScriptRoot/pass.secret"

# get the user name and password from file
if (Test-Path $usernamePath)
{
  $remoteUserName = Get-Content -Path $usernamePath
}
else
{
  $remoteUserName = Read-Host "please input the username on the server"
  $remoteUserName | Out-File $usernamePath -Encoding utf8
}
if (Test-Path $passwordPath)
{
  $password = Get-Content -Path $passwordPath
}
else
{
  $password = Read-Host "please input your password on the server"
  $password | Out-File $passwordPath -Encoding utf8
}

# make credential
$securePass =ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($remoteUserName, $securePass)

# commiting and pushing to git
if (-not $noGitSync)
{
  # add git ignore file to ignore your password and username file
  if ( -not (Test-Path "$PSScriptRoot\.gitignore"))
  {
    "*.secret" | Out-File -FilePath "$PSScriptRoot\.gitignore" -Encoding utf8
  }

  Write-Host "commiting and pushing to git" -ForegroundColor Yellow
  Start-Process "git" -ArgumentList "commit -am `"deploying $deploymentPath`"" -NoNewWindow -Wait
  Start-Process "git" -ArgumentList "push" -NoNewWindow -Wait
  Write-Host "push successful" -ForegroundColor Green
  Write-Host
  Write-Host
}

# connecting
Write-Host "connecting to remote" -ForegroundColor Yellow
Write-Verbose "remote computer name: $remoteComputerName"
Write-Verbose "remote user name:  $remoteUserName"
Write-Verbose "password: $password"
$session = New-SFTPSession -ComputerName $remoteComputerName -Credential $credential
Write-Host "connection successful" -ForegroundColor Green
Write-Host
Write-Host

Write-Host "pushing file to the server" -ForegroundColor Yellow
Set-SFTPFile -SFTPSession $seesion -RemotePath 'www' -LocalFile $deploymentPaths -Overwrite
Write-Host "push sucess" -ForegroundColor Green
Write-Host
Write-Host

# End connection
Write-Host "trying to close remote connection" -ForegroundColor Yellow
$success = Remove-SFTPSession -SSHSession $session
if ($success)
{
  Write-Host "connection closed successfully, exiting" -ForegroundColor Green
}
else
{
  Write-Host "fail to close connection. Please close it yourself." -ForegroundColor Red
}
