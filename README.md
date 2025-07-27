# Háztartási Menedzser Streamlit Alkalmazás

Ez egy teljes körű háztartási kezelő alkalmazás, amely Streamlit-tel készült.

## Funkciók

### 🛒 Bevásárlólista
- Termékek hozzáadása név, mennyiség és kategória megadásával
- Termékek törlése és megvásároltként való megjelölése
- Kategóriák szerint rendezés

### 📖 Receptek
- Receptek hozzáadása hozzávalókkal és elkészítési útmutatóval
- Receptek kategorizálása
- Hozzávalók automatikus hozzáadása a bevásárlólistához

### ✅ Teendők
- Feladatok hozzáadása prioritással és határidővel
- Feladatok kategorizálása
- Lejárt feladatok kiemelése

### 🏠 Dashboard
- Összesítő statisztikák
- Gyors áttekintés minden területről

## Telepítés és futtatás

1. Klónozd le a repository-t
2. Telepítsd a függőségeket:
   ```bash
   pip install -r requirements.txt
   ```
3. Futtasd az alkalmazást:
   ```bash
   streamlit run streamlit_app.py
   ```

## Streamlit Community Cloud-ra feltöltés

1. Hozz létre egy GitHub repository-t
2. Töltsd fel a fájlokat (streamlit_app.py, requirements.txt, README.md)
3. Menj a https://share.streamlit.io oldalra
4. Jelentkezz be GitHub-bel
5. Válaszd ki a repository-t és a streamlit_app.py fájlt
6. Kattints a Deploy gombra

## Használat

Az alkalmazás automatikusan menti az adatokat a Streamlit session state-ben. 
Az adatok a böngésző bezárásáig megmaradnak.

## Továbbfejlesztési lehetőségek

- Adatbázis kapcsolat (SQLite/PostgreSQL)
- Felhasználói hitelesítés
- Adatok exportálása/importálása
- Email emlékeztetők
- Mobiloptimalizálás
