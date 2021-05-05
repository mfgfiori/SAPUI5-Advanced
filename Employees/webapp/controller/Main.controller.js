// @ts-nocheck
sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller     
         */
    function (Controller) {
        return Controller.extend("logaligroup.Employees.controller.Main", {
            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("detailsEmployeeView");
            },
            onInit: function () {
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

                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetails, this);

                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this);

            },
            showEmployeeDetails: function (category, nameEvent, oData) {
                var detailView = this.getView().byId("detailsEmployeeView")
                detailView.bindElement("odataNorthwind>" + oData);
                this.getView().getModel("jsonLayouts").setProperty("/ActiveKey", "TwoColumnsMidExpanded");

                var incidenceModel = new sap.ui.model.json.JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

                //this.onReadODataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID);
            },
            onSaveODataIncidence: function (channel, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID;
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();

                console.log('data', data);
                console.log('IncidenceModel', incidenceModel);
                console.log('Incidence', incidenceModel[data.incidenceRow]);
                
                if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undefined') {
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                    };
                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
//                            this.onReadODataIncidence.bind(this)(employeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveOK"));
                        }.bind(this),
                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("odataSaveKO"));
                        }.bind(this)
                    })
                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChanges"));
                };
            }

        //     onReadODataIncidence: function (employeeID) {

        //         this.getView().getModel("incidenceModel").read("/IncidentsSet", {
        //             filters: [
        //                 new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
        //                 new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
        //             ],
        //             success: function (data) {
        //                 var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
        //                 incidenceModel.setData(data.results);
        //                 var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
        //                 tableIncidence.removeAllContent();

        //                 for (var incidence in data.results) {
        //                     var newIncidence = sap.ui.xmlfragment("logaligroup.Employees.fragment.NewIncidence", this._detailEmployeeView.getController());
        //                     this._detailEmployeeView.addDependent(newIncidence);
        //                     newIncidence.bindElement("incidenceModel>/" + incidence);
        //                     tableIncidence.addContent(newIncidence);
        //                 }
        //             }.bind(this),
        //             error: function (e) {
        //             }
        //         });
        //     }
         });
    });