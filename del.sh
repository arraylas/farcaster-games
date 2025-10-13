# Pastikan node_modules dihapus dari index dan di-ignore
echo "node_modules/" >> .gitignore

# Gunakan filter-repo untuk bersih-bersih riwayat besar
pip install git-filter-repo

# Hapus semua file node_modules dari seluruh riwayat Git
git filter-repo --path node_modules --invert-paths --force
