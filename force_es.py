import re

chrome_path = "/Users/apple/Desktop/Panama-peptides /src/components/StorefrontChrome.js"
with open(chrome_path, "r") as f:
    content = f.read()

# Hardcode lang to 'es' in function signatures if it defaults to 'en'
content = content.replace("lang = 'en'", "lang = 'es'")

# Remove the language toggle block
# It looks like:
# <button type="button"
# className="clone-nav-lang"
# onClick={() => { onLanguage(lang === 'en' ? 'es' : 'en'); setMenuOpen(false); }}
# aria-label="Switch language"
# >
# {lang === 'en' ? 'Ver en español' : 'View in English'}
# </button>

toggle_pattern1 = re.compile(r'<button[^>]*className="clone-nav-lang"[^>]*>.*?</button>', re.DOTALL)
content = toggle_pattern1.sub('', content)

# There is also one in the StorefrontHeader main section:
# <button type="button"
# className="clone-lang-toggle"
# onClick={() => onLanguage(lang === 'en' ? 'es' : 'en')}
# aria-label={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
# title={lang === 'en' ? 'Cambiar a español' : 'Switch to English'}
# >
# {lang === 'en' ? 'ES' : 'EN'}
# </button>

toggle_pattern2 = re.compile(r'<button[^>]*className="clone-lang-toggle"[^>]*>.*?</button>', re.DOTALL)
content = toggle_pattern2.sub('', content)

with open(chrome_path, "w") as f:
    f.write(content)

