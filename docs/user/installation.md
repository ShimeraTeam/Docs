# Installation

This page shows how to add Shimera to your project from a prebuilt release. You download one archive, point your build at it, and build. You don't need to compile Shimera yourself.

## Requirements

- A C++20 compiler: MSVC on Windows, GCC or Clang on Linux.
- [xmake](https://xmake.io/), which downloads GLEW and your host library for you.
- A GPU with OpenGL 3.3 or higher.

## Install

### 1. Download the release

Open the [latest release](https://github.com/ShimeraTeam/Shimera/releases/latest) and download the archive that matches your host library, system and architecture:

```
shimera-<version>-<host>-<system>-<arch>
```

| Part | Values |
|------|--------|
| `<host>` | `sfml` (SFML 3), `raylib`, `sdl` (SDL3), `glfw` (plain OpenGL: GLFW, SDL in OpenGL mode, ...) |
| `<system>` | `windows` (`.zip`) or `linux` (`.tar`) |
| `<arch>` | `x64`, or `x86` for 32-bit Windows builds |

For example, an SFML game on 64-bit Windows uses `shimera-0.6.1-sfml-windows-x64.zip`.

### 2. Extract it into your project

Extract the archive into a `libs/` folder of your project. On Linux, use `tar -xf shimera-0.6.1-sfml-linux-x64.tar`. You get:

```
my_game/
  libs/
    shimera-0.6.1/
      include/  headers, starting with shimera.hpp
      lib/      static libraries, release and debug (-d)
      res/      compiled shaders
      bin/      debug symbols (Windows only)
  src/
    main.cpp
  xmake.lua
```

### 3. Configure xmake.lua

Pick your host library and copy its `xmake.lua`. Each one links two Shimera libraries, your host's and the core, in that order:

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
    add_defines("SHIMERA_STATIC") -- the release libraries are static
    if is_mode("debug") then
        add_links("shimera-sfml-d", "shimera-d")
    else
        add_links("shimera-sfml", "shimera")
    end

    -- Temporary for Shimera 0.6.x: load the shaders from libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- lets the fix below replace the built-in path
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
        if not os.isfile(file) or io.readfile(file) ~= source then -- rewrite only on change, so builds stay incremental
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
    add_defines("SHIMERA_STATIC") -- the release libraries are static
    if is_mode("debug") then
        add_links("shimera-raylib-d", "shimera-d")
    else
        add_links("shimera-raylib", "shimera")
    end

    -- Temporary for Shimera 0.6.x: load the shaders from libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- lets the fix below replace the built-in path
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
        if not os.isfile(file) or io.readfile(file) ~= source then -- rewrite only on change, so builds stay incremental
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
    add_defines("SHIMERA_STATIC") -- the release libraries are static
    if is_mode("debug") then
        add_links("shimera-sdl-d", "shimera-d")
    else
        add_links("shimera-sdl", "shimera")
    end

    -- Temporary for Shimera 0.6.x: load the shaders from libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- lets the fix below replace the built-in path
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
        if not os.isfile(file) or io.readfile(file) ~= source then -- rewrite only on change, so builds stay incremental
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
    add_packages("glew", "glfw") -- GLFW is for your window, Shimera does not use it

    add_includedirs("libs/shimera-0.6.1/include")
    add_linkdirs("libs/shimera-0.6.1/lib")
    add_defines("SHIMERA_STATIC") -- the release libraries are static
    if is_mode("debug") then
        add_links("shimera-glfw-d", "shimera-d")
    else
        add_links("shimera-glfw", "shimera")
    end

    -- Temporary for Shimera 0.6.x: load the shaders from libs/shimera-0.6.1/res
    if is_plat("windows") then
        add_ldflags("/INCREMENTAL:NO", {force = true}) -- lets the fix below replace the built-in path
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
        if not os.isfile(file) or io.readfile(file) ~= source then -- rewrite only on change, so builds stay incremental
            io.writefile(file, source)
        end
        target:add("files", file)
    end)
```

:::

Keep the package versions above: they are the ones the 0.6.1 libraries were built with. For a 32-bit Windows build, run `xmake f -a x86` once before building.

::: warning Temporary block for 0.6.x
The 0.6.x libraries look for `res` in the folder they were built in, on the release build machine. The block at the end of each `xmake.lua` makes them read `libs/shimera-0.6.1/res` from your project instead, wherever your program starts. It goes away in a future version.

That path is fixed in your program when it is built, so the program finds its shaders only on the computer it was built on. If you move or rename the project, run `xmake` again.
:::

### 4. Build and run

In your project folder:

```bash
xmake # downloads the packages on the first run, then builds
xmake run # starts your program
```

To build in debug, run `xmake f -m debug` once, then `xmake` again.

In your code, include `shimera.hpp` and the header of your host target:

```cpp
#include <shimera.hpp>
#include <hosts/SfmlTarget.hpp> // or RaylibTarget, SdlTarget, GlfwTarget
```

::: info Other build systems
Shimera does not provide CMake or Meson files, but any build system works. Add `include/` to the include path and `lib/` to the library path, define `SHIMERA_STATIC`, compile in C++20, and link `shimera-<host>` then `shimera` (with `-d` in debug), followed by GLEW (static) and OpenGL. On Windows, use the dynamic C runtime: `/MD` in release, `/MDd` in debug. For 0.6.x, also compile the `shimera_res.cpp` file that the `xmake.lua` above writes, and link with `/INCREMENTAL:NO` on MSVC.
:::

## Next steps

Read the [User Guide](./index.md) to create a context, a host target and your first effect pipeline.
