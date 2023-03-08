const momoTokenChanger = {
    registerSettings: () => {
        game.settings.register("momos-token-changer", "imageSelectionDisplay", {
            name: game.i18n.format("MomoTokenChanger.ImageSelectionDisplayName"),
            hint: game.i18n.format("MomoTokenChanger.ImageSelectionDisplayHint"),
            scope: "client",
            config: true,
            type: Boolean,
            default: true
        });
        game.settings.register("momos-token-changer", "allowSizeChange", {
            name: game.i18n.format("MomoTokenChanger.AllowSizeChangeName"),
            hint: game.i18n.format("MomoTokenChanger.AllowSizeChangeHint"),
            scope: "world",
            config: true,
            type: Boolean,
            default: true
        });
    }
};

Hooks.on("init", function () {
    momoTokenChanger.registerSettings();
});