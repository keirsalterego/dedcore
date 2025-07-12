$ErrorActionPreference = 'Stop';

$packageName = 'dedcore'
$url = 'https://github.com/manishyoudumb/dedcore/releases/download/v0.1.0/dedcore-x86_64-pc-windows-msvc.zip' # Update with actual release URL
$checksum = '' # Add checksum for verification
$checksumType = 'sha256'
$toolsDir = "$(Split-Path -Parent $MyInvocation.MyCommand.Definition)"

$packageArgs = @{
  packageName   = $packageName
  unzipLocation = $toolsDir
  url           = $url
  checksum      = $checksum
  checksumType  = $checksumType
}

Install-ChocolateyZipPackage @packageArgs

# Add to PATH
Install-ChocolateyPath -PathToInstall "$toolsDir" -PathType 'Machine'
