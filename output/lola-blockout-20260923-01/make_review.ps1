$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$root = $PSScriptRoot
$views = 0,45,90,135,180,225,270,315 | ForEach-Object { 'view_{0:000}.png' -f $_ }
$close = @('opening_close_000.png','opening_close_030.png','opening_close_060.png','opening_close_090.png','opening_close_low_angle.png','open_back_close.png')
function Make-Sheet($files, $columns, $name) {
    $cell = 450
    $rowHeight = 485
    $rows = [int][math]::Ceiling($files.Count / $columns)
    $bitmap = [System.Drawing.Bitmap]::new($cell * $columns, $rowHeight * $rows)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $font = [System.Drawing.Font]::new('Segoe UI', 13)
    try {
        $graphics.Clear([System.Drawing.Color]::FromArgb(28,30,34))
        $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        for ($i=0; $i -lt $files.Count; $i++) {
            $x = ($i % $columns) * $cell
            $y = [math]::Floor($i / $columns) * $rowHeight
            $img = [System.Drawing.Image]::FromFile((Join-Path $root $files[$i]))
            try {
                if ($img.Width -ne 1100 -or $img.Height -ne 1100) { throw "Unexpected render size: $($files[$i])" }
                $graphics.DrawImage($img, [int]$x, [int]$y, $cell, $cell)
            } finally { $img.Dispose() }
            $graphics.DrawString($files[$i], $font, [System.Drawing.Brushes]::White, [single]($x+12), [single]($y+$cell+5))
        }
        $bitmap.Save((Join-Path $root $name), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally { $font.Dispose(); $graphics.Dispose(); $bitmap.Dispose() }
}
Make-Sheet $views 4 'eight-view-contact-sheet.png'
Make-Sheet $close 3 'inspection-contact-sheet.png'
$cards = ($views + $close | ForEach-Object { '<a href="{0}"><img src="{0}" loading="lazy"><span>{0}</span></a>' -f $_ }) -join "`n"
$html = @"
<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Lola mannequin - blockout inspection</title>
<style>body{margin:32px;background:#1c1e22;color:#eee;font:16px system-ui}h1{font-size:26px}p{max-width:950px;line-height:1.6}a{color:#d9e8ff}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}.grid a{background:#292c31;text-decoration:none;padding-bottom:12px}.grid img{width:100%;display:block}.grid span{display:block;padding:8px 12px}nav{margin:24px 0}</style>
<h1>Lola mannequin · 재질 전 blockout</h1>
<p>45° 간격 8방향: 동일 직교 카메라 배율 3.7m, 고도 10°, 거리 8m, 1100×1100. 0°=정면, 90°=착용자 오른쪽, 180°=후면. 근접뷰는 별도 검사 카메라입니다. 단순 색상만 사용했으며 sheer는 불투명 위치 표시용입니다. 형태 승인 대기 상태입니다.</p>
<nav><a href="lola-blockout.blend">Blender 파일</a> · <a href="object_manifest.json">오브젝트 구조</a> · <a href="camera_manifest.json">카메라 조건</a> · <a href="geometry_inspection.json">절단면 검사</a> · <a href="eight-view-contact-sheet.png">8방향 모음</a> · <a href="inspection-contact-sheet.png">근접 검수 모음</a></nav>
<div class="grid">$cards</div></html>
"@
[System.IO.File]::WriteAllText((Join-Path $root 'review.html'), $html, [System.Text.UTF8Encoding]::new($false))
Write-Output 'Validated 14 PNG renders; created 2 contact sheets and review.html'
