# Installation

Cette page explique comment ajouter Shimera à votre projet à partir d'une release précompilée. Vous téléchargez une archive, vous indiquez son emplacement à votre build, et vous compilez. Vous n'avez pas besoin de compiler Shimera vous-même.

## Prérequis

- Un compilateur C++20 : MSVC sous Windows, GCC ou Clang sous Linux.
- [xmake](https://xmake.io/), qui télécharge GLEW et votre bibliothèque hôte pour vous.
- Un GPU compatible OpenGL 3.3 ou supérieur.

## Installer

### 1. Télécharger la release

Ouvrez la [dernière release](https://github.com/ShimeraTeam/Shimera/releases/latest) et téléchargez l'archive qui correspond à votre bibliothèque hôte, à votre système et à votre architecture :

```
shimera-<version>-<host>-<system>-<arch>
```

| Partie | Valeurs |
|--------|---------|
| `<host>` | `sfml` (SFML 3), `raylib`, `sdl` (SDL3), `glfw` (OpenGL pur : GLFW, SDL en mode OpenGL, ...) |
| `<system>` | `windows` (`.zip`) ou `linux` (`.tar`) |
| `<arch>` | `x64`, ou `x86` pour les builds Windows 32 bits |

Par exemple, un jeu SFML sous Windows 64 bits utilise `shimera-0.6.1-sfml-windows-x64.zip`.

### 2. L'extraire dans votre projet

Extrayez l'archive dans un dossier `libs/` de votre projet. Sous Linux, utilisez `tar -xf shimera-0.6.1-sfml-linux-x64.tar`. Vous obtenez :

```
my_game/
  libs/
    shimera-0.6.1/
      include/  en-têtes, à commencer par shimera.hpp
      lib/      bibliothèques statiques, release et debug (-d)
      res/      shaders compilés
      bin/      symboles de debug (Windows uniquement)
  src/
    main.cpp
  xmake.lua
```

### 3. Configurer xmake.lua

Choisissez votre bibliothèque hôte et copiez son `xmake.lua`. Chacun lie deux bibliothèques Shimera, celle de votre hôte puis le cœur, dans cet ordre :

::: code-group

```lua [SFML]
add_rules("mode.debug", "mode.release")

add_requires("glew 2.2.0", "sfml 3.0.1")

target("my_game")
    set_kind("binary")
    set_languages("c++20")
    add_files("src/*.cpp")
    add_packages("glew", "sfml")

    add_includedirs("libs/shimera-0.6.1/include")
    add_linkdirs("libs/shimera-0.6.1/lib")
    add_defines("SHIMERA_STATIC") -- les bibliothèques de la release sont statiques
    if is_mode("debug") then
        add_links("shimera-sfml-d", "shimera-d")
    else
        add_links("shimera-sfml", "shimera")
    end

    -- Temporaire pour Shimera 0.6.x : charge les shaders depuis libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- permet au correctif ci-dessous de remplacer le chemin intégré
    end
    on_load(function (target)
        local res = path.join(os.projectdir(), "libs", "shimera-0.6.1", "res")
        local source = '#define SHIMERA_RES_DIR R"(' .. res .. ')"\n' .. [[
#include <Resources.inl>
using ShimeraPath = std::string (*)(const std::string&);
ShimeraPath shimeraBuiltinShader = &shimera::builtinShader;
ShimeraPath shimeraGeneratedShader = &shimera::generatedShader;
ShimeraPath shimeraMaterialShader = &shimera::materialShader;
]]
        local file = path.join(target:autogendir(), "shimera_res.cpp")
        if not os.isfile(file) or io.readfile(file) ~= source then -- réécrit seulement en cas de changement, pour garder des builds incrémentaux
            io.writefile(file, source)
        end
        target:add("files", file)
    end)
```

```lua [raylib]
add_rules("mode.debug", "mode.release")

add_requires("glew 2.2.0", "raylib 5.5")

target("my_game")
    set_kind("binary")
    set_languages("c++20")
    add_files("src/*.cpp")
    add_packages("glew", "raylib")

    add_includedirs("libs/shimera-0.6.1/include")
    add_linkdirs("libs/shimera-0.6.1/lib")
    add_defines("SHIMERA_STATIC") -- les bibliothèques de la release sont statiques
    if is_mode("debug") then
        add_links("shimera-raylib-d", "shimera-d")
    else
        add_links("shimera-raylib", "shimera")
    end

    -- Temporaire pour Shimera 0.6.x : charge les shaders depuis libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- permet au correctif ci-dessous de remplacer le chemin intégré
    end
    on_load(function (target)
        local res = path.join(os.projectdir(), "libs", "shimera-0.6.1", "res")
        local source = '#define SHIMERA_RES_DIR R"(' .. res .. ')"\n' .. [[
#include <Resources.inl>
using ShimeraPath = std::string (*)(const std::string&);
ShimeraPath shimeraBuiltinShader = &shimera::builtinShader;
ShimeraPath shimeraGeneratedShader = &shimera::generatedShader;
ShimeraPath shimeraMaterialShader = &shimera::materialShader;
]]
        local file = path.join(target:autogendir(), "shimera_res.cpp")
        if not os.isfile(file) or io.readfile(file) ~= source then -- réécrit seulement en cas de changement, pour garder des builds incrémentaux
            io.writefile(file, source)
        end
        target:add("files", file)
    end)
```

```lua [SDL3]
add_rules("mode.debug", "mode.release")

add_requires("glew 2.2.0", "libsdl3")

target("my_game")
    set_kind("binary")
    set_languages("c++20")
    add_files("src/*.cpp")
    add_packages("glew", "libsdl3")

    add_includedirs("libs/shimera-0.6.1/include")
    add_linkdirs("libs/shimera-0.6.1/lib")
    add_defines("SHIMERA_STATIC") -- les bibliothèques de la release sont statiques
    if is_mode("debug") then
        add_links("shimera-sdl-d", "shimera-d")
    else
        add_links("shimera-sdl", "shimera")
    end

    -- Temporaire pour Shimera 0.6.x : charge les shaders depuis libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- permet au correctif ci-dessous de remplacer le chemin intégré
    end
    on_load(function (target)
        local res = path.join(os.projectdir(), "libs", "shimera-0.6.1", "res")
        local source = '#define SHIMERA_RES_DIR R"(' .. res .. ')"\n' .. [[
#include <Resources.inl>
using ShimeraPath = std::string (*)(const std::string&);
ShimeraPath shimeraBuiltinShader = &shimera::builtinShader;
ShimeraPath shimeraGeneratedShader = &shimera::generatedShader;
ShimeraPath shimeraMaterialShader = &shimera::materialShader;
]]
        local file = path.join(target:autogendir(), "shimera_res.cpp")
        if not os.isfile(file) or io.readfile(file) ~= source then -- réécrit seulement en cas de changement, pour garder des builds incrémentaux
            io.writefile(file, source)
        end
        target:add("files", file)
    end)
```

```lua [OpenGL (GLFW)]
add_rules("mode.debug", "mode.release")

add_requires("glew 2.2.0", "glfw 3.4")

target("my_game")
    set_kind("binary")
    set_languages("c++20")
    add_files("src/*.cpp")
    add_packages("glew", "glfw") -- GLFW sert à votre fenêtre, Shimera ne l'utilise pas

    add_includedirs("libs/shimera-0.6.1/include")
    add_linkdirs("libs/shimera-0.6.1/lib")
    add_defines("SHIMERA_STATIC") -- les bibliothèques de la release sont statiques
    if is_mode("debug") then
        add_links("shimera-glfw-d", "shimera-d")
    else
        add_links("shimera-glfw", "shimera")
    end

    -- Temporaire pour Shimera 0.6.x : charge les shaders depuis libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- permet au correctif ci-dessous de remplacer le chemin intégré
    end
    on_load(function (target)
        local res = path.join(os.projectdir(), "libs", "shimera-0.6.1", "res")
        local source = '#define SHIMERA_RES_DIR R"(' .. res .. ')"\n' .. [[
#include <Resources.inl>
using ShimeraPath = std::string (*)(const std::string&);
ShimeraPath shimeraBuiltinShader = &shimera::builtinShader;
ShimeraPath shimeraGeneratedShader = &shimera::generatedShader;
ShimeraPath shimeraMaterialShader = &shimera::materialShader;
]]
        local file = path.join(target:autogendir(), "shimera_res.cpp")
        if not os.isfile(file) or io.readfile(file) ~= source then -- réécrit seulement en cas de changement, pour garder des builds incrémentaux
            io.writefile(file, source)
        end
        target:add("files", file)
    end)
```

:::

Gardez les versions de packages ci-dessus : ce sont celles avec lesquelles les bibliothèques 0.6.1 ont été compilées. Pour un build Windows 32 bits, lancez `xmake f -a x86` une fois avant de compiler.

::: warning Bloc temporaire pour la 0.6.x
Les bibliothèques 0.6.x cherchent `res` dans le dossier où elles ont été compilées, sur la machine de build de la release. Le bloc à la fin de chaque `xmake.lua` leur fait lire `libs/shimera-0.6.1/res` depuis votre projet, quel que soit le dossier où votre programme démarre. Il disparaît dans une version future.

Ce chemin est fixé dans votre programme à la compilation : le programme ne trouve donc ses shaders que sur l'ordinateur où il a été compilé. Si vous déplacez ou renommez le projet, relancez `xmake`.
:::

### 4. Compiler et lancer

Dans le dossier de votre projet :

```bash
xmake # télécharge les packages au premier lancement, puis compile
xmake run # lance votre programme
```

Pour compiler en debug, lancez `xmake f -m debug` une fois, puis `xmake` à nouveau.

Dans votre code, incluez `shimera.hpp` et l'en-tête de votre host target :

```cpp
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp> // ou RaylibTarget, SdlTarget, GlfwTarget
```

::: info Autres systèmes de build
Shimera ne fournit pas de fichiers CMake ou Meson, mais n'importe quel système de build fonctionne. Ajoutez `include/` au chemin d'inclusion et `lib/` au chemin des bibliothèques, définissez `SHIMERA_STATIC`, compilez en C++20, et liez `shimera-<host>` puis `shimera` (avec `-d` en debug), suivis de GLEW (statique) et d'OpenGL. Sous Windows, utilisez le runtime C dynamique : `/MD` en release, `/MDd` en debug. Pour la 0.6.x, compilez aussi le fichier `shimera_res.cpp` qu'écrit le `xmake.lua` ci-dessus, et liez avec `/INCREMENTAL:NO` sous MSVC.
:::

## Étapes suivantes

Lisez le [Guide Utilisateur](./index.md) pour créer un contexte, un host target et votre premier pipeline d'effets.
