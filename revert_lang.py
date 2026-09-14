import re

# 1. page.js
page_path = "/Users/apple/Desktop/Panama-peptides /src/app/page.js"
with open(page_path, "r") as f:
    page_content = f.read()

page_content = page_content.replace(
    "  useEffect(() => {\n    setLang('es');\n  }, []);",
    """  useEffect(() => {
    const selectedLang = localStorage.getItem(USER_SELECTED_LANG_KEY) === 'true'
      ? localStorage.getItem('lang') || 'es'
      : 'es';
    setLang(selectedLang);
  }, []);"""
)
with open(page_path, "w") as f:
    f.write(page_content)

# 2. catalog/page.js
cat_path = "/Users/apple/Desktop/Panama-peptides /src/app/catalog/page.js"
with open(cat_path, "r") as f:
    cat_content = f.read()

cat_content = cat_content.replace(
    "setLang('es');",
    """const hasUserSelectedLang = localStorage.getItem(USER_SELECTED_LANG_KEY) === 'true';
    const selectedLang = hasUserSelectedLang
      ? localStorage.getItem('lang') || 'es'
      : 'es';
    setLang(selectedLang);"""
)

cat_content = cat_content.replace(
    "// langParam removed",
    """const langParam = urlParams.get('lang');
    if (langParam && !hasUserSelectedLang) {
      setLang(langParam);
    }"""
)
with open(cat_path, "w") as f:
    f.write(cat_content)

