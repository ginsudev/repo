./apt-ftparchive packages ./debs > Packages
bzip2 -c9 Packages > Packages.bz2
xz -c9 Packages > Packages.xz
xz -5fkev --format=lzma Packages > Packages.lzma
lz4 -c9 Packages > Packages.lz4
gzip -c9 Packages > Packages.gz
zstd -c19 Packages > Packages.zst

grep -E "Origin:|Label:|Suite:|Version:|Codename:|Architectures:|Components:|Description:" Release > Base
./apt-ftparchive release . > Release
cat Base Release > out && mv out Release

gpg -abs -u 899B36199C54025DB78E3E65F7244B91712F1A3C -o Release.gpg Release
rm Base