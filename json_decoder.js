console.log(json_);

function json_to_html(){

    let json = json_;

    let grid_html = "<b><a href=''>" + json[0][0] + "</a></b>";

    grid_html += "<div class='grid-container'>";

	for(let i = 0; i < json[1][0].length; i++){

        grid_html += "<div id=color" + json[1][2][i];

        grid_html += " class='linkbox' style='grid-row:" + json[1][1][i] + ";'>";

        grid_html += "<h1><p>" + json[1][0][i] + "</p></h1>";

		for(let j = 0; j < json[2][i].length; j++){

            grid_html += "<li><a href='"

            grid_html += json[2][i][j][1]

            grid_html += "' target='_blank'>"

            grid_html += json[2][i][j][0]

            grid_html += "</a></li></br>"
		}

		grid_html += "</div>"
	}

	grid_html += "</div>";

	return grid_html;
}

let grid_html = json_to_html();