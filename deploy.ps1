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

Start-Process "git" -ArgumentList "commit -am `"deploying $deploymentPath`"" -NoNewWindow -Wait
Start-Process "git" -ArgumentList "push" -NoNewWindow -Wait

# connecting
Write-Host "connecting to remote"
Write-Verbose "remote computer name: $remoteComputerName"
Write-Verbose "credential:  $credential"
$session = New-SSHSession -ComputerName $remoteComputerName -Credential $credential
Write-Host "connection successful" -ForegroundColor Green


# helper function
function Invoke-RemoteCommand ($command)
{

  Write-Verbose "excuting command: $command"
  $responce = Invoke-SSHCommand -SSHSession $session -Command $command

  $responce.output | ForEach-Object {Write-Host $_}

  Write-Verbose "exit code: $($responce.ExitStatus)"
}

# update the repo
Invoke-RemoteCommand -command "cd ~/COMP298/ && git pull"

# End connection
$success = Remove-SSHSession -SSHSession $session
if ($success)
{
  Write-Host "connection closed successfully, exiting"
}
else
{
  Write-Host "fail to close connection. Please close it yourself."
}
