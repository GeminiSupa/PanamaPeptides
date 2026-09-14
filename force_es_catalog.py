import re

page_path = "/Users/apple/Desktop/Panama-peptides /src/app/catalog/page.js"
with open(page_path, "r") as f:
    content = f.read()

# Remove language check and set default to 'es'
content = re.sub(
    r"const hasUserSelectedLang = localStorage\.getItem\(USER_SELECTED_LANG_KEY\) === 'true';\s*const selectedLang = hasUserSelectedLang\s*\?\s*localStorage\.getItem\('lang'\) \|\| 'es'\s*:\s*'es';\s*setLang\(selectedLang\);",
    r"setLang('es');",
    content
)

# And remove urlparam parsing for lang
content = re.sub(
    r"const langParam = urlParams\.get\('lang'\);\s*if\s*\(langParam\s*&&!\s*hasUserSelectedLang\)\s*{\s*setLang\(langParam\);\s*}",
    r"// langParam removed",
    content
)

with open(page_path, "w") as f:
    f.write(content)
