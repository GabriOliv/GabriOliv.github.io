console.log(json_);

function json_to_html(){

    let json = json_;

    let grid_html = "<div class='container col-xs-4 p-1 my-3 bg-secondary text-center'><h1><a href='index.html' style='color: #FFF; text-decoration: none;'>";

    grid_html += json[0][0] + "</a></h1></div>";

    grid_html += "<div class='container col-xs-4 p-1 bg-secondary'>";

    let id = 0;

	for(let i = 0; i < json[1][0].length; i++){

        grid_html += "<div class='row p-3'>";

		for(let j = 0; j < json[1][0][i]; j++){

            let color_bg = (Number(json[1][3][id]) % 10);
            let color_letter = Number(json[1][3][id]) - color_bg;

            let color_string_bg = "";
            let color_string_letter = "";

            color_letter = color_letter / 10;

                if(color_bg == 1){  color_string_letter = "light"  }
                else{               color_string_letter = "dark"   }

                if(color_bg == 0){      color_string_bg = "white"      }
                else if(color_bg == 1){ color_string_bg = "light"      }
                else if(color_bg == 2){ color_string_bg = "secondary"  }
                else if(color_bg == 3){ color_string_bg = "dark"       }
                else if(color_bg == 4){ color_string_bg = "primary"    }
                else if(color_bg == 5){ color_string_bg = "success"    }
                else if(color_bg == 6){ color_string_bg = "danger"     }
                else if(color_bg == 7){ color_string_bg = "warning"    }
                else{                   color_string_bg = "info"       }


            grid_html += "<div class='col-sm-" + json[1][2][id] + "'>";
            grid_html += "<nav class='navbar navbar-" + color_string_letter + " text-left bg-" + color_string_bg + "'>";

            grid_html += "<div class='container-fluid'>";

            grid_html += "<div class='container-fluid " + color_string_bg + "' type='button' data-bs-toggle='collapse' data-bs-target='#navbar" + id + "'>";

            grid_html += "<a class='navbar-brand' href='#'>" + json[1][1][id] + "</a></div>";

            grid_html += "<div class='collapse navbar-collapse' id='";
            grid_html += "navbar" + id + "'><ul class='navbar-nav'>";

            for(let k = 0; k < json[2][id].length; k++){

                grid_html += "<li class='nav-item'><a class='nav-link' href='";
                grid_html += json[2][id][k][1];
                grid_html += "' target='_blank'>";
                grid_html += json[2][id][k][0];
                grid_html += "</a></li>";

            }

            grid_html += "</div></div></nav></div>";

            id++;
        }

		grid_html += "</div>";

    }

    grid_html += "</div>";

	return grid_html;

}

let grid_html = json_to_html();

