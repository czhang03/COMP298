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
  [Alias("PSPath")]
  [ValidateNotNullOrEmpty()]
  [string]
  $deploymentPath
)

$ErrorActionPreference = "stop"
Import-Module Posh-SSH

# remote names
$remoteComputerName = "cs.wheatoncollege.edu"
$remoteUserName = "czhang"
# make credential
$password = Get-Content -Path "$PSScriptRoot/pass.secret"
$securePass =ConvertTo-SecureString $password -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($remoteUserName, $securePass)

# commiting and pushing to git
Write-Host "commiting and pushing to git" -ForegroundColor Yellow
Start-Process "git" -ArgumentList "commit -am `"deploying $deploymentPath`"" -NoNewWindow -Wait
Start-Process "git" -ArgumentList "push" -NoNewWindow -Wait
Write-Host "push successful" -ForegroundColor Green
Write-Host
Write-Host

# connecting
Write-Host "connecting to remote" -ForegroundColor Yellow
Write-Verbose "remote computer name: $remoteComputerName"
Write-Verbose "remote user name:  $remoteUserName"
Write-Verbose "password: $password"
$session = New-SSHSession -ComputerName $remoteComputerName -Credential $credential
Write-Host "connection successful" -ForegroundColor Green
Write-Host
Write-Host


# helper function
function Invoke-RemoteCommand ($command)
{

  Write-Verbose "excuting command: $command"
  $responce = Invoke-SSHCommand -SSHSession $session -Command $command

  $responce.output | ForEach-Object {Write-Host $_ -ForegroundColor Gray}
  $responce.error | ForEach-Object {Write-Host $_ -ForegroundColor Red}

  Write-Verbose "exit code: $($responce.ExitStatus)"
}

# update the repo
Write-Host "updating remote repo" -ForegroundColor Yellow
Invoke-RemoteCommand -command "cd ~/COMP298/ && git pull"
Write-Host

# End connection
Write-Host "trying to close remote connection" -ForegroundColor Yellow
$success = Remove-SSHSession -SSHSession $session
if ($success)
{
  Write-Host "connection closed successfully, exiting" -ForegroundColor Green
}
else
{
  Write-Host "fail to close connection. Please close it yourself." -ForegroundColor Red
}
