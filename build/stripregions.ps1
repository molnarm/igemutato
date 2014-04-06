param (
    [string]$source,
    [string]$output,
    [string]$condition
 )
 
[Regex]::Replace([Regex]::Replace((Get-Content $source -Raw),
'(?sm)// #if ((!' + $condition + ')|(?!' + $condition + ')[A-Z]+).*?// #endif ((!' + $condition + ')|(?!' + $condition + ')[A-Z]+)', ''),
'// #(end)?if !?[A-Z]+', '') | Set-Content $output