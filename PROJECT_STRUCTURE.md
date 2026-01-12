# Seder Music Production - Project Architecture Documentation

## 1. Vue d'ensemble (Arborescence)

```
src/
├── app/
│   ├── [lang]/                  # ROUES PRINCIPALES (i18n)
│   │   ├── (legal)/             # [Vide]
│   │   ├── (marketing)/         # Pages Marketing (Agence, Services, Billeterie, Blog)
│   │   ├── artistes/            # Routes Dynamiques ([slug]/page.tsx) 
│   │   ├── contact/             # Route Contact
│   │   ├── layout.tsx           # Layout Racine
│   │   └── page.tsx             # Page d'Accueil
│   ├── api/                     # API Routes (Backend)
│   ├── globals.css              # Styles globaux
│   └── ...config files          # (robots.ts, sitemap.ts)
├── components/
│   ├── 3d/                      # Éléments Trois.js / R3F
│   ├── home/                    # Sections Page d'Accueil
│   ├── layout/                  # Composants Structurels (Header, Footer)
│   ├── player/                  # Lecteur Audio Global
│   ├── seo/                     # Schémas JSON-LD
│   ├── talents/                 # Composants "Artistes" (Cards, Profile)
│   ├── ui/                      # Bibliothèque UI Reutilisable
│   └── utils/                   # Utilitaires Techniques
├── dictionaries/                # Fichiers de Traduction (JSON)
├── hooks/                       # Hooks Personnalisés
├── lib/                         # Logique & Types Partagés
└── store/                       # État Global (Zustand)
```

## 2. ZOOM SPÉCIFIQUE : Le dossier `app/[lang]`

Ce dossier gère le routage et l'internationalisation. Le paramètre dynamique `[lang]` (fr, en, he) est injecté dans toutes les pages.

### `src/app/[lang]/layout.tsx`
*   **URL** : Racine de toutes les pages (ex: `domain.com/fr/*`).
*   **Rôle** : **Server Component (Layout)**. Point d'entrée principal.
*   **Flux de données** :
    *   Récupère `dict.nav` via `getDictionary(lang)` pour le passer au `Header`.
    *   Initialise `ReactLenis` (Smooth Scroll), `Header`, `Footer`, et `PersistentPlayer`.
*   **Structure** : Enveloppe `children` avec les providers globaux et la structure HTML de base.

### `src/app/[lang]/page.tsx`
*   **URL** : `domain.com/fr` (Accueil).
*   **Rôle** : **Server Component (Page)**.
*   **Flux de données** : Charge tout le dictionnaire `dict` coté serveur et distribue les sous-parties (`dict.home`, `dict.services_section`) aux composants enfants.
*   **Imports Clés** : `HomeHero`, `ServicesSection`, `FinalManifesto`, `FinalCTA`.

### `src/app/[lang]/(marketing)/agence/page.tsx`
*   **URL** : `domain.com/fr/agence`.
*   **Rôle** : **Server Component**. Page "Agence/About".
*   **Flux de données** : Utilise `dict.agency` pour le texte (Vision, Leadership).
*   **Structure** : Page très éditoriale, peu de composants complexes, principalement du JSX statique stylisé et des images optimisées (`next/image`).

### `src/app/[lang]/(marketing)/services/[service]/page.tsx`
*   **URL** : `domain.com/fr/services/production` (et autres services).
*   **Rôle** : **Server Component**.
*   **Flux de données** : Charge la section spécifique du dictionnaire (ex: `dict.service_pages.production`) et la passe à un **Client Component** dédié.
*   **Architecture Pattern** : "Data Fetching Server-Side" -> "Interactive Client-Side".
    *   *Exemple Production* : Passe les données à `ProductionClient`.
    *   *Exemple Influence* : Passe les données à `InfluenceClient`.
    *   *Exemple Booking* : Passe les données à `BookingClient`.
    *   *Exemple Talent* : Passe les données à `TalentClient`.

### `src/app/[lang]/contact/page.tsx`
*   **URL** : `domain.com/fr/contact`.
*   **Rôle** : **Server Component**.
*   **Imports Clés** : `ContactClient` (Formulaire interactif).
*   **Flux de données** : Passe le dictionnaire complet pour les labels du formulaire.

### `src/app/[lang]/artistes/[slug]/page.tsx`
*   **URL** : `domain.com/fr/artistes/nom-artiste`.
*   **Rôle** : **Server Component**. Page de profil dynamique.
*   **Flux de données** : Combine les données statiques du dictionnaire (`graines` ou `artistes`) avec des "Mock Data" (Biographie riche, gallerie) simulées directement dans le fichier (devrait idéalement venir d'un CMS).
*   **Changements à apporter** : 
    *   Modifier les contenus des pages des artistes.
    *   Ajouter les contenus des pages des artistes dans les dictionnaires.
*   **Imports Clés** : `ArtistProfileClient` (Gère l'affichage et le `Turntable` 3D).

## 3. Dictionnaire des composants (Hors App)

### `/components/3d/`
*   `ParticleTextHero.tsx` : Effet de particules "SEDER" (Hero).
*   `Turntable.tsx` : Platine vinyle 3D interactive (Page Talents).
*   `WebGLCheck.tsx` : Wrapper de sécurité pour désactiver la 3D sur les vieux appareils.

### `/components/home/`
*   `ServicesSection.tsx` : Grille principale avec cartes magnétiques vidéo (`SmartCinematicVideo`).
*   `HomeHero.tsx` : En-tête de la page d'accueil.

### `/components/ui/` (Kit UI)
*   **`SmartCinematicVideo.tsx`** : Lecteur vidéo optimisé avec "Phantom Loading" (Image -> Vidéo fluide).
*   **`SonicButton.tsx`** : Bouton signature avec effet d'onde sonore (Canvas).
*   **`MagneticButton.tsx`** : Bouton avec physique magnétique au survol.
*   **`InfiniteTicker.tsx`** : Bandeau défilant infini (Partenaires).

### `/hooks/` & `/store/`
*   `useVideoPreloader.ts` : Gestion du téléchargement des blobs vidéo en arrière-plan.
*   `useAudioStore.ts` : État global du lecteur audio (Zustand).

## 4. Analyse de la pertinence (Nettoyage)

Basé sur l'analyse des imports :

### 🚩 Fichiers potentiellement Orphelins (À vérifier/Supprimer)
Ces fichiers existent mais ne semblent pas importés dans le code source scanné :
1.  **`src/components/ui/BlurImage.tsx`** : Semble inutilisé (remplacé par `next/image` standard ?).
2.  **`src/components/ui/GlitchText.tsx`** : Pas d'usage explicite trouvé dans les pages principales.
3.  **`src/app/[lang]/(legal)/`** : Dossier vide.

### ♻️ Fichiers Importants (Core)
*   `SchemaOrg.tsx` : Utilisé partout pour le SEO, critique.
*   `PersistentPlayer.tsx` : Critique pour l'expérience utilisateur (musique continue).

## 5. Suggestions de réorganisation

1.  **Suppression du dossier `(legal)`** : S'il est vide, supprime-le pour éviter la confusion.
2.  **Centralisation des Données Artistes** :
    *   Actuellement, les données riches (Bio, Galerie) sont hardcodées dans `artistes/[slug]/page.tsx`.
    *   *Suggestion* : Déplacer ces données dans un fichier `src/data/artists.ts` ou `src/lib/artists-data.ts` pour séparer la logique de vue des données.
3.  **Nettoyage UI** : Supprimer `BlurImage` et `GlitchText` si vous confirmez qu'ils ne font partie d'aucune "Features à venir".
