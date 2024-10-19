frappe.ui.form.on("Custom Sales Invoice", "before_save", function(frm, cdt, cdn){
        var p = frm.doc;	
        for(var i = 0; i < item.length; i++) {
        	frappe.call({
						"method": "erpnext.stock.utils.get_stock_balance",
						args: {
							  warehouse:"Stores - LL",
							  item_code:i.item,     			
							},								
							callback: function (data) {						
							console.log(data);
						}
					})
              }
        });

frappe.ui.form.on("Custom Sales Invoice Item", "item", function(frm, cdt, cdn){
        var p = frm.doc;	
         var d = locals[cdt][cdn];
        frappe.call({
						"method": "frappe.client.get",
						args: {
							doctype: "Item Price",							
							filters: {
								item_code:["=", d.item]
								}           			
							},								
							callback: function (data) {	
							console.log(data);				
							frappe.model.set_value(d.doctype, d.name, "price_list_rate",data.message.price_list_rate);	
						}
					})
    });