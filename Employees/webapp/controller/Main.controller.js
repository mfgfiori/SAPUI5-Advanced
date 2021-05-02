// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller     
     */
    function (Controller) {
        return Controller.extend("logaligroup.Employees.controller.Main",{
            onInit: function (){ 
                 var oView = this.getView();

                 var oJSONModelEmpl = new sap.ui.model.json.JSONModel();
                 oJSONModelEmpl.loadData("./localService/mockdata/Employees.json", false);
                 oView.setModel(oJSONModelEmpl, "jsonEmployees");

                var oJSONModelCountries = new sap.ui.model.json.JSONModel();
                oJSONModelCountries.loadData("./localService/mockdata/Countries.json", false);
                oView.setModel(oJSONModelCountries, "jsonCountries");

                var oJSONModelLayouts = new sap.ui.model.json.JSONModel();
                oJSONModelLayouts.loadData("./localService/mockdata/Layouts.json", false);
                oView.setModel(oJSONModelLayouts, "jsonLayouts");

                var oJSONModelConfig = new sap.ui.model.json.JSONModel({
                     visibleId: true,
                     visibleName: true,
                     visibleCountry: true,
                     visibleCity: false,
                     visibleBtnShowCity: true,
                     visibleBtnHideCity: false
                 });
                oView.setModel(oJSONModelConfig, "jsonConfig");

                this._bus= sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

            },
            showEmployeeDetails: function(category, nameEvent, oData) {
                var detailView = this.getView().byId("detailsEmployeeView")
                detailView.bindElement("jsonEmployees>" + oData);
                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");
            }          
        });
});