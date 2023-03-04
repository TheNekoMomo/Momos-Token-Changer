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
    }
};

Hooks.on("init", function () {
    momoTokenChanger.registerSettings();
});