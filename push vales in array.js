frappe.ui.form.on("Custom Sales Invoice", "before_save", function(frm, cdt, cdn){
        var p = frm.doc;	
         var d = locals[cdt][cdn];
        var  item_codes = new Array();
        var  qtys = new Array();
        var   r = new Array();
 
       			p.items.forEach(function(entry){
       				frappe.call({
						"method": "erpnext.stock.utils.get_stock_balance",
						args: {
							  warehouse:"Stores - LL",
							  item_code:entry.item_code,     			
							},	
							async: false,							
					 callback: function(data) {
			            console.log(data);
        				if(!data.message){
        					item_codes.push(entry.item_code);
        					qtys.push(entry.qty)
        					}
        				}
        			});
        		});		 
        });