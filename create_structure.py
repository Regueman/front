import os

base_path = "src"

folders = [
    "components/UI",
    "components/Layout",
    "pages",
    "features/Auth",
    "features/Dashboard",
    "services",
    "hooks",
    "context",
    "store",
    "utils",
    "styles",
    "assets/images",
    "assets/icons",
    "assets/fonts",
    "routes",
    "tests/components",
    "tests/pages"
]

for folder in folders:
    os.makedirs(os.path.join(base_path, folder), exist_ok=True)

print("Estructura ampliada creada con éxito!")
