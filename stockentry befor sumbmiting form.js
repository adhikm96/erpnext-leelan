frappe.ui.form.on("Custom Sales Invoice", "before_save", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    var r = new Array();
    p.items.forEach(function(entry) {
        if (entry.stock_entry_needed==1) {
            if (p.company == "Leelan") {
                r[0] = {
                    "item_code": entry.item_code,
                    "qty": entry.qty,
                    "cost_center": "Main - LD"
                };
                frappe.call({
                    "method": "frappe.client.insert",
                    args: {
                        doc: {
                            doctype: "Stock Entry",
                            "purpose": "Material Issue",
                            "company": "Lata Dresses",
                            "from_warehouse": "Stores - LD",
                            "items": r
                        }
                    },
                    async: false,
                    callback: function(data) {
                        console.log(data);                       
                        data.message['doctype'] = "Stock Entry";
                        frappe.call({
                            "method": "frappe.client.submit",
                            args: {
                                doc: data.message
                            },
                            freeze: true,
                            async: false,
                            callback: function(res) {
                                console.log(res);
                                entry.material_issue_reference = data.message.name
                                r[0] = {
                                    "item_code": entry.item_code,
                                    "qty": entry.qty,
                                    "cost_center": "Main - LL"
                                };
                                frappe.call({
                                    "method": "frappe.client.insert",
                                    args: {
                                        doc: {
                                            doctype: "Stock Entry",
                                            "purpose": "Material Receipt",
                                            "company": "Leelan",
                                            "to_warehouse": "Stores - LL",
                                            "items": r
                                        }
                                    },
                                    freeze: true,
                                    callback: function(data) {
                                        console.log(data);
                                        data.message['doctype'] = "Stock Entry";

                                        frappe.call({
                                            "method": "frappe.client.submit",
                                            args: {
                                                doc: data.message
                                            },
                                            freeze: true,
                                            async: false,
                                            callback: function(res) {
                                                console.log(res);
                                                entry.material_receipt_reference = res.message.name
                                                entry.stock_updated = 1
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            if (p.company == "Lata Dresses") {
                r[0] = {
                    "item_code": entry.item_code,
                    "qty": entry.qty,
                    "cost_center": "Main - LL"
                };
                frappe.call({
                    "method": "frappe.client.insert",
                    args: {
                        doc: {
                            doctype: "Stock Entry",
                            "purpose": "Material Issue",
                            "company": "Leelan",
                            "from_warehouse": "Stores - LL",
                            "items": r
                        }
                    },
                    async: false,
                    callback: function(data) {
                        console.log(data);
                        data.message['doctype'] = "Stock Entry";
                        frappe.call({
                            "method": "frappe.client.submit",
                            args: {
                                doc: data.message
                            },
                            freeze: true,
                            async: false,
                            callback: function(res) {
                                console.log(res);
                                 entry.material_issue_reference = data.message.name
                                r[0] = {
                                    "item_code": entry.item_code,
                                    "qty": entry.qty,
                                    "cost_center": "Main - LD"
                                };
                                frappe.call({
                                    "method": "frappe.client.insert",
                                    args: {
                                        doc: {
                                            doctype: "Stock Entry",
                                            "purpose": "Material Receipt",
                                            "company": "Lata Dresses",
                                            "to_warehouse": "Stores - LD",
                                            "items": r
                                        }
                                    },
                                    freeze: true,
                                    callback: function(data) {
                                        console.log(data);
                                        data.message['doctype'] = "Stock Entry";

                                        frappe.call({
                                            "method": "frappe.client.submit",
                                            args: {
                                                doc: data.message
                                            },
                                            freeze: true,
                                            async: false,
                                            callback: function(res) {
                                                console.log(res);
                                                entry.material_receipt_reference = res.message.name
                                                entry.stock_updated = 1
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

    });
    refresh_field("items");
});
frappe.ui.form.on("Custom Sales Invoice Item", "item_code", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    frappe.model.set_value(d.doctype, d.name, "qty", "1");
    frappe.model.set_value(d.doctype, d.name, "rate", d.price_list_rate);
    frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    if (p.company == "Leelan") {
        frappe.call({
            "method": "erpnext.stock.utils.get_stock_balance",
            args: {
                warehouse: "Stores - LL",
                item_code: d.item_code,
            },
            async: false,
            callback: function(data) {
                console.log(data);
                if (!data.message) {
                    frappe.call({
                        "method": "erpnext.stock.utils.get_stock_balance",
                        args: {
                            warehouse: "Stores - LD",
                            item_code: d.item_code,
                        },
                        async: false,
                        callback: function(data) {
                            console.log(data);
                            if (!data.message) {

                                frappe.msgprint("No Stock in both Warehouse")
                            } else {
                                frappe.model.set_value(d.doctype, d.name, "stock_entry_needed", 1);
                            }
                        }
                    })
                }
            }
        })

    }
    if (p.company == "Lata Dresses") {
        frappe.call({
            "method": "erpnext.stock.utils.get_stock_balance",
            args: {
                warehouse: "Stores - LD",
                item_code: d.item_code,
            },
            async: false,
            callback: function(data) {
                console.log(data);
                if (!data.message) {
                    frappe.call({
                        "method": "erpnext.stock.utils.get_stock_balance",
                        args: {
                            warehouse: "Stores - LL",
                            item_code: d.item_code,
                        },
                        async: false,
                        callback: function(data) {
                            console.log(data);
                            if (!data.message) {
                                frappe.msgprint("No Stock in both Warehouse")
                            } else {
                                frappe.model.set_value(d.doctype, d.name, "stock_entry_needed", 1);
                            }
                        }
                    })
                }
            }
        })

    }
});


frappe.ui.form.on("Custom Sales Invoice Item", "qty", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
});

frappe.ui.form.on("Custom Sales Invoice Item", "rate", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
});
frappe.ui.form.on("Custom Sales Invoice Item", "margin_rate_or_amount", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    var rwm = 0;
    if (d.margin_type == "Percentage") {
        rwm = d.price_list_rate + (d.price_list_rate * d.margin_rate_or_amount / 100);
    } else if (d.margin_type == "Amount") {
        rwm = d.price_list_rate + d.margin_rate_or_amount;
    }
    if (d.discount_amount) {
        frappe.model.set_value(d.doctype, d.name, "rate_with_margin", rwm);
        frappe.model.set_value(d.doctype, d.name, "rate", rwm - d.discount_amount);
        frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    } else {
        frappe.model.set_value(d.doctype, d.name, "rate_with_margin", rwm);
        frappe.model.set_value(d.doctype, d.name, "rate", rwm);
        frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    }
});

frappe.ui.form.on("Custom Sales Invoice Item", "margin_type", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    var rwm = 0;
    if (d.margin_type == "Percentage") {
        rwm = d.price_list_rate + (d.price_list_rate * d.margin_rate_or_amount / 100);
    } else if (d.margin_type == "Amount") {
        rwm = d.price_list_rate + d.margin_rate_or_amount;
    }
    if (d.discount_amount) {
        frappe.model.set_value(d.doctype, d.name, "rate_with_margin", rwm);
        frappe.model.set_value(d.doctype, d.name, "rate", rwm - d.discount_amount);
        frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    } else {
        frappe.model.set_value(d.doctype, d.name, "rate_with_margin", rwm);
        frappe.model.set_value(d.doctype, d.name, "rate", rwm);
        frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    }
});

frappe.ui.form.on("Custom Sales Invoice Item", "discount_percentage", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    var dis = 0;
    if (d.rate_with_margin) {
        dis = d.rate_with_margin * d.discount_percentage / 100;
        frappe.model.set_value(d.doctype, d.name, "discount_amount", dis);
        frappe.model.set_value(d.doctype, d.name, "rate", d.rate_with_margin - dis);
        frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    } else {
        dis = d.price_list_rate * d.discount_percentage / 100;
        frappe.model.set_value(d.doctype, d.name, "discount_amount", dis);
        frappe.model.set_value(d.doctype, d.name, "rate", d.price_list_rate - dis);
        frappe.model.set_value(d.doctype, d.name, "amount", d.qty * d.rate);
    }
});

frappe.ui.form.on("Custom Sales Invoice", "refresh", function(frm, cdt, cdn) {
    frm.fields_dict.items.grid.get_field('item_code').get_query =
        function() {
            return {
                filters: {
                    "is_stock_item": 1
                }
            }
        }
});

frappe.ui.form.on("Custom Sales Invoice", "after_save", function(frm, cdt, cdn) {
    var p = frm.doc;
    var d = locals[cdt][cdn];
    var r = new Array();
            for(var i=0; i < p.items.length; i++){
                 r[i] = {
                    "item_code": p.items[i].item_code,
                    "qty": p.items[i].qty,
                    "rate":p.items[i].rate,
                    "amount":p.items[i].amount,
                    "margin_type":p.items[i].margin_type,
                    "margin_rate_or_amount":p.items[i].margin_rate_or_amount,
                    "rate_with_margin":p.items[i].rate_with_margin,
                    "discount_percentage":p.items[i].discount_percentage,
                    "discount_amount":p.items[i].discount_amount,
                };
            }
                frappe.call({
                    "method": "frappe.client.insert",
                    args: {
                        doc: {
                            doctype: "Sales Invoice",
                            "due_date":frappe.datetime.get_today(),
                            "customer": p.customer,
                            "company": p.company,
                            "items": r
                        }
                    },
                    async: false,
                    callback: function(data) {
                        console.log(data);                       
                        data.message['doctype'] = "Sales Invoice";
                        frappe.call({
                            "method": "frappe.client.submit",
                            args: {
                                doc: data.message
                            },
                            freeze: true,
                            async: false,
                            callback: function(res) {
                                console.log(res);
                                frappe.model.set_value(p.doctype, p.name, "sales_invoice_reference_no",data.message.name);
                            }
                        })
                    }
                })
            });