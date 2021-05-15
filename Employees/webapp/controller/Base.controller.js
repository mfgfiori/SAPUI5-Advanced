// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller",
],
    /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller     
         */
    function (Controller) {
        return Controller.extend("logaligroup.Employees.controller.Base", {
            onInit: function () {
            },
            toOrderDetails: function (oEvent) {
                var orderId = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
                var oRoute = sap.ui.core.UIComponent.getRouterFor(this);
                oRoute.navTo("RouteOrderDetails", { OrderId: orderId });
            }
        });
    });

