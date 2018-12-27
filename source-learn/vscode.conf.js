{
    // 以像素为单位控制字号。
    "editor.fontSize": 14,
    "editor.lineHeight": 24,
    "editor.tabSize": 4,
    "editor.codeLens": true,
    //   "editor.minimap.enabled": false,
    "editor.rulers": [120],
    "editor.cursorStyle": "block",
    // "editor.fontFamily": "Fira Code",
    "editor.fontLigatures": true,
    "editor.matchBrackets": false,
    "editor.renderIndentGuides": false,
    "editor.quickSuggestions": {
        "other": true,
        "comments": true,
        "strings": true
    },
    "editor.renderWhitespace": "boundary",
    "editor.cursorBlinking": "smooth",
    "editor.formatOnPaste": false,
    "editor.formatOnSave": false,

    "workbench.iconTheme": "vscode-icons",
    "workbench.colorTheme": "Dracula Soft",
    "terminal.external.osxExec": "iTerm.app",

    // 缩进参考线
    "guides.normal.color.dark": "rgba(91, 91, 91, 0.6)",
    "guides.normal.color.light": "rgba(220, 220, 220, 0.7)",
    "guides.active.color.dark": "rgba(210, 110, 210, 0.6)",
    "guides.active.color.light": "rgba(200, 100, 100, 0.7)",
    "guides.active.style": "dashed",
    "guides.normal.style": "dashed",
    "guides.stack.style": "dashed",

    // vetur
    "vetur.format.options.tabSize": 4,
    "vetur.format.defaultFormatterOptions": {
        "prettier": {
            // Prettier option here
            "semi": true,
            "singleQuote": true
        },
        "prettyhtml": {
            "printWidth": 100, // No line exceeds 100 characters
            "singleQuote": false, // Prefer double quotes over single quotes
            "wrapAttributes": true,
            "sortAttributes": true
        },
        "js-beautify-html": {
            // force-aligned | force-expand-multiline
            // "wrap_attributes": "force-expand-multiline",
            "wrap_attributes": "force-aligned"
        }
    },

    // files
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "files.trimFinalNewlines": true,
    "files.associations": {
        "*.vue": "vue",
        "*.html": "html"
    },

    // eslint
    "eslint.autoFixOnSave": true,
    "eslint.options": {
        "extensions": [".js", ".vue"]
    },
    // "eslint.validate": ["javascript", "javascriptreact", "vue", "vue-html"],
    "eslint.validate": [
        "javascript",
        {
            "language": "vue",
            "autoFix": true
        },
        "html",
        "vue",
        "javascriptreact"
    ],
    "search.exclude": {
        "**/node_modules": true,
        "**/bower_components": true,
        "**/dist": true
    },
    "emmet.syntaxProfiles": {
        "javascript": "jsx",
        "vue": "html",
        "vue-html": "html"
    },
    "extensions.autoUpdate": true,
    "workbench.sideBar.location": "left",

    // prettier
    "prettier.tabWidth": 4,
    "prettier.printWidth": 100,
    "prettier.singleQuote": true,
    "prettier.eslintIntegration": true
}
