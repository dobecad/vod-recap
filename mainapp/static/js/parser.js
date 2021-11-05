// Will hold individual parsers for certain visualizations.
// Input should be JSON retrieved from API

function create_visualizations(chat_data) {
    // Insert all functions that create visualizations
    emote_messages_per_second_vis(chat_data, 30);
    messages_per_second_vis(chat_data, 30);
    emote_or_not_messages_per_second_vis(chat_data, 30);
    sub_messages_per_second_vis(chat_data, 30);
    sub_or_not_messages_per_second_vis(chat_data, 30);
    messages_per_user_vis(chat_data);
    emote_by_usage_vis(chat_data);

    // Print header-bar to display VOD header information
    if (url.substr(12, 6) == "twitch"){
        document.getElementById("vod-header").innerHTML = 
            "<a href='" + url + "'><img src = \"static/twitch-logo.png\"></a>" +
            "<div id = \"web-title\">Visualizing Twitch VOD Data</div>" + "<br>";
    }
    else if (url.substr(12, 7) == "youtube"){
        document.getElementById("vod-header").innerHTML = 
            "<a href='" + url + "'><img src = \"static/youtube-logo.png\"></a>" + 
            "<div id = \"web-title\">Visualizing Youtube VOD Data</div>" + "<br>";
    }
    // Vod Information
    document.getElementById("vod-header").innerHTML += 
        "<div id = \"vod-info\">" + 
        "Number of Messages: " + chat_data.length + "<br>" +
        "VOD Length: " + chat_data[chat_data.length - 1]["time_stamp_in_vod"] + "<br>" + 
        "</div>";
}



function emote_messages_per_second_parse(chat, interval) {
    // Function to parse the chat vod data into the proper format for a particular visualization
    if (!interval) {
        return;
    }

    let current_position = 0;
    var mps = {};
    for (var msg = 0; msg < chat.length; msg++) {
        if (chat[msg]["is_emote"]) {
            tis = parseInt(chat[msg]["time_in_seconds"]);
            let position = Math.floor(tis / interval);
            while (current_position <= position) {
                mps[current_position] = 0;
                current_position++;
            }
            mps[position] = mps[position] + 1;
        }
    }
    return mps;
}

function emote_messages_per_second_vis(chat_data, interval) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = emote_messages_per_second_parse(chat_data, interval);
    
    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', `Time (${interval} second bin)`);
    vis.addColumn('number', 'Emote Messages');

    for (let msg = 0; msg < Object.keys(parsed_data).length; msg++) {
        vis.addRow([String(msg), parsed_data[msg]]);
    }

    var options = {
        title: `Number of emote messages per ${interval} seconds`,
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('emote_messages_per_second'));
    chart.draw(vis, options);
}



function messages_per_second_parse(chat, interval) {
    // Function to parse the chat vod data into the proper format for a particular visualization
    if (!interval) {
        return;
    }

    let current_position = 0;
    var mps = {};
    for (var msg = 0; msg < chat.length; msg++) {
        tis = parseInt(chat[msg]["time_in_seconds"]);
        let position = Math.floor(tis / interval);
        while (current_position <= position) {
            mps[current_position] = 0;
            current_position++;
        }
        mps[position] = mps[position] + 1;
    }
    return mps;
}

function messages_per_second_vis(chat_data, interval) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = messages_per_second_parse(chat_data, interval);
    
    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', `Time (${interval} second bin)`);
    vis.addColumn('number', 'Messages');

    for (let msg = 0; msg < Object.keys(parsed_data).length; msg++) {
        vis.addRow([String(msg), parsed_data[msg]]);
    }

    var options = {
        title: `Number of messages per ${interval} seconds`,
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('messages_per_second'));
    chart.draw(vis, options);
}



function emote_or_not_messages_per_second_parse(chat, interval) {
    // Function to parse the chat vod data into the proper format
    if (!interval) {
        return;
    }

    let current_position = 0;
    var mps = {};
    for (var msg = 0; msg < chat.length; msg++) {
        tis = parseInt(chat[msg]["time_in_seconds"]);
        let position = Math.floor(tis / interval);

        while (current_position <= position) {
            mps[current_position] = [0,0];
            current_position++;
        }

        if (chat[msg]["is_emote"]) {
            mps[position][1] = mps[position][1] + 1;
        }
        else{
            mps[position][0] = mps[position][0] + 1;
        }
    }
    return mps;
}

function emote_or_not_messages_per_second_vis(chat_data, interval) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = emote_or_not_messages_per_second_parse(chat_data, interval);
    
    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', `Time (${interval} second bin)`);
    vis.addColumn('number', 'Messages');
    vis.addColumn('number', 'Emote Messages');

    for (const [time, counts] of Object.entries(parsed_data)) {
        vis.addRow([time, counts[0], counts[1]]);
    }

    var options = {
        title: `Number of emote vs not emote messages per ${interval} seconds`,
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('emote_or_not_messages_per_second'));
    chart.draw(vis, options);
}



function sub_messages_per_second_parse(chat, interval) {
    // Function to parse the chat vod data into the proper format for a particular visualization
    if (!interval) {
        return;
    }

    let current_position = 0;
    var mps = {};
    for (var msg = 0; msg < chat.length; msg++) {
        if (chat[msg]["subscriber"]) {
            tis = parseInt(chat[msg]["time_in_seconds"]);
            let position = Math.floor(tis / interval);
            while (current_position <= position) {
                mps[current_position] = 0;
                current_position++;
            }
            mps[position] = mps[position] + 1;
        }
    }
    return mps;
}

function sub_messages_per_second_vis(chat_data, interval) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = sub_messages_per_second_parse(chat_data, interval);
    
    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', `Time (${interval} second bin)`);
    vis.addColumn('number', 'Subscriber Messages');

    for (let msg = 0; msg < Object.keys(parsed_data).length; msg++) {
        vis.addRow([String(msg), parsed_data[msg]]);
    }

    var options = {
        title: `Number of subscriber messages per ${interval} seconds`,
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('sub_messages_per_second'));
    chart.draw(vis, options);
}



function sub_or_not_messages_per_second_parse(chat, interval) {
    // Function to parse the chat vod data into the proper format
    if (!interval) {
        return;
    }

    let current_position = 0;
    var mps = {};
    for (var msg = 0; msg < chat.length; msg++) {
        tis = parseInt(chat[msg]["time_in_seconds"]);
        let position = Math.floor(tis / interval);

        while (current_position <= position) {
            mps[current_position] = [0,0];
            current_position++;
        }

        if (chat[msg]["subscriber"]) {
            mps[position][1] = mps[position][1] + 1;
        }
        else{
            mps[position][0] = mps[position][0] + 1;
        }
    }
    return mps;
}

function sub_or_not_messages_per_second_vis(chat_data, interval) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = sub_or_not_messages_per_second_parse(chat_data, interval);
    
    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', `Time (${interval} second bin)`);
    vis.addColumn('number', 'Not Subscriber');
    vis.addColumn('number', 'Subscriber');

    for (const [time, counts] of Object.entries(parsed_data)) {
        vis.addRow([time, counts[0], counts[1]]);
    }

    var options = {
        title: `Number of Subscriber vs non-Subscriber messages per ${interval} seconds`,
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.LineChart(document.getElementById('sub_or_not_messages_per_second'));
    chart.draw(vis, options);
}



function messages_per_user_parse(chat) {
    // Function to parse the chat vod data into the proper format for a particular visualization
    var mpu = {};
    for (var msg = 0; msg < chat.length; msg++) {
        let author = chat[msg]["author"];
        if (author in mpu){
            mpu[author] += 1;
        }
        else{
            mpu[author] = 1;
        }
    }
    return mpu;
}

function messages_per_user_vis(chat_data) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = messages_per_user_parse(chat_data);
    
    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', 'User');
    vis.addColumn('number', 'Messages');

    for (const [user, count] of Object.entries(parsed_data)) {
        vis.addRow([user, count]);
    }

    var options = {
        title: "Number of messages per user",
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('messages_per_user'));
    chart.draw(vis, options);
}



function emote_by_usage_parse(chat) {
    // Function to parse the chat vod data into the proper format
    var ebu = {};
    for (var msg = 0; msg < chat.length; msg++) {
        if (chat[msg]["emotes"].length > 0) {
            for (var emote = 0; emote < chat[msg]["emotes"].length; emote++){
                let curr_emote = chat[msg]["emotes"][emote];
                if (curr_emote in ebu){
                    ebu[curr_emote] += 1;
                }
                else{
                    ebu[curr_emote] = 1;
                }
            }
        }
    }
    return ebu;
}

function emote_by_usage_vis(chat_data) {
    // Function to create the visualization, and insert the visualization into its respective <div>
    var parsed_data = emote_by_usage_parse(chat_data);

    var vis = new google.visualization.DataTable(); 
    vis.addColumn('string', 'Emote');
    vis.addColumn('number', 'Usage');

    for (const [emote, count] of Object.entries(parsed_data)) {
        vis.addRow([emote, count]);
    }

    var options = {
        title: "Usage for Each Emote during a VOD",
        legend: {
            position: "bottom"
        }
    };

    var chart = new google.visualization.ColumnChart(document.getElementById('emote_by_usage'));
    chart.draw(vis, options);
}
