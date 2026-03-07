try {
    console.log("Loading auth...");
    require("./src/modules/auth/auth.routes");
    console.log("Loading feedback...");
    require("./src/modules/feedback/feedback.routes");
    console.log("Loading admin...");
    require("./src/modules/admin/admin.routes");
    console.log("Loading tiffin...");
    require("./src/modules/tiffin/tiffin.routes");
    console.log("Loading subscription...");
    require("./src/modules/subscription/subscription.routes");
    console.log("Loading meal-selection...");
    require("./src/modules/subscription/mealSelection.routes");
    console.log("Loading order...");
    require("./src/modules/order/order.routes");
    console.log("Loading recommendation...");
    require("./src/modules/recommendation/recommendation.routes");
    console.log("All routes loaded!");
} catch (err) {
    console.error("LOAD ERROR:", err.message);
    console.error("STACK:", err.stack);
}
