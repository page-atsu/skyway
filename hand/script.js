'use strict';


// Get Parametersを取得するやつ
function getQueryParams() {
    if (1 < document.location.search.length) {
        const query = document.location.search.substring(1);
        const params = query.split('&');

        const result = {};
        for(var param of params) {
            const element = param.split('=');
            const key = decodeURIComponent(element[0]);
            const value = decodeURIComponent(element[1]);
            result[key] = value;
        }
        return result;
    }
    return null;
}

window.onload = ()=> {
 
    const el1 = document.getElementById('recv-current-angle1');
    const el2 = document.getElementById('recv-current-angle2');
    const el3 = document.getElementById('recv-current-angle3');
    const el4 = document.getElementById('recv-current-angle4');
    const el_s1 = document.getElementById('send-target-angle1');
    const el_s2 = document.getElementById('send-target-angle2');
    const el_s3 = document.getElementById('send-target-angle3');
    const el_s4 = document.getElementById('send-target-angle4'); 
    const el_r1 = document.getElementById('is-reach1');
    const el_r2 = document.getElementById('is-reach2');
    const el_r3 = document.getElementById('is-reach3');
    const el_r4 = document.getElementById('is-reach4');   


    let target_data1 = 0.0;
    let target_data2 = 0.0;
    let target_data3 = 0.0;
    let target_data4 = 0.0;
              
    const query = getQueryParams();
    // api keyはGet Parameterから取る
    // これは演習で簡単に設定するための雑な処理で推奨ではない
    //const key = query["key"];
    const key = '39f05a53-160c-4ffd-a468-11cdc3be64ef'
    //peer idもGet Parameterから取る
    //const peer_id = query["peer_id"]
    const peer_id = 'PEER_ID'
    const peer = new Peer(peer_id, {
        key: key,
        debug: 3
    });

    peer.on('open', function (a) {
        console.log(a);
        // SkyWay Serverに自分のapi keyで繋いでいるユーザ一覧を取得
        let peers = peer.listAllPeers(peers => {
            //JavaScript側で入れたやつとRuby側で入れたやつが出てくればよい
            console.log(peers);
        });
    });

    peer.on('error', function (err) {
        alert(err.message);
    });
    
    document.getElementById("call_button").onclick = ()=>{
        //const target_id = document.getElementById("target_id_box").value;
        const target_id = 'PEER_ID2'
        const call = peer.call(target_id, null, {
            videoReceiveEnabled: true
        });

        call.on('stream', (stream) => {
            document.getElementById("remote_video").srcObject = stream;
        });

        const connection = peer.connect(target_id, {
            serialization: "none"
        });

        var elem = document.getElementById('range');
        var target = document.getElementById('value');
        var rangeValue = function (elem, target) {
            return function(evt){
            target.innerHTML = elem.value;
            }
        }
        elem.addEventListener('input', rangeValue(elem, target));    
        
        connection.once('open', async () => {
            //messages.textContent = `=== DataConnection has been opened 1 ===\n`;
        });
        connection.on('data', (data)=> {
            console.log(data);
            // console.log(String.fromCharCode.apply("", new Uint8Array(data)));
            // messages.textContent += String.fromCharCode.apply("", new Uint8Array(data));
            // messages.textContent += ' \n';
            let csvContent = String.fromCharCode.apply("", new Uint8Array(data))
            let recv_current_data = csvContent.split(",");
            el1.innerHTML = 'current1: ' + recv_current_data[0];
            el2.innerHTML = 'current2: ' + recv_current_data[1];
            el3.innerHTML = 'current3: ' + recv_current_data[2]; 
            el4.innerHTML = 'current4: ' + recv_current_data[3];  
  
            if (Math.abs(recv_current_data[0] - target_data1) < 0.01 ){
                el_r1.innerHTML = 'Reached OK';
            }else{
                el_r1.innerHTML = 'Not reached'; 
            }
            if (Math.abs(recv_current_data[1] - target_data2) < 0.01 ){
                el_r2.innerHTML = 'Reached OK';
            }else{
                el_r2.innerHTML = 'Not reached'; 
            }
            if (Math.abs(recv_current_data[2] - target_data3) < 0.01 ){
                el_r3.innerHTML = 'Reached OK';
            }else{
                el_r3.innerHTML = 'Not reached'; 
            }
            if (Math.abs(recv_current_data[3] - target_data4) < 0.01 ){
                el_r4.innerHTML = 'Reached OK';
            }else{
                el_r4.innerHTML = 'Not reached'; 
            } 
                       
        });
        el_s1.innerHTML = 'target1: ' + target_data1;
        el_s2.innerHTML = 'target2: ' + target_data2;
        el_s3.innerHTML = 'target3: ' + target_data3;
        el_s4.innerHTML = 'target4: ' + target_data4;

        document.getElementById("start_button").onclick = function() {
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;   
            connection.send(target_all);
        };
        
        document.getElementById("text-button1a").onclick = function() {
            target_data1 = target_data1 + 0.1;
            el_s1.innerHTML = 'target1: ' + target_data1;
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;   
            connection.send(target_all);
        };
        document.getElementById("text-button2a").onclick = function() {
            target_data2 = target_data2 + 0.1;
            el_s2.innerHTML = 'target2: ' + target_data2;
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4; 
            connection.send(target_all);
        };
        document.getElementById("text-button1b").onclick = function() {
            target_data1 = target_data1 - 0.1;
            el_s1.innerHTML = 'target1: ' + target_data1;
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;
            connection.send(target_all); 
        };
        document.getElementById("text-button2b").onclick = function() {
            target_data2 = target_data2 - 0.1;
            el_s2.innerHTML = 'target2: ' + target_data2;
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;
            connection.send(target_all); 
        };

        document.getElementById("text-button3a").onclick = function() {
            target_data3 = target_data3 + 0.1;
            el_s3.innerHTML = 'target3: ' + target_data3;
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;
            connection.send(target_all); 
        };
        document.getElementById("text-button4a").onclick = function() {
            target_data4 = target_data4 + 0.1;
            el_s4.innerHTML = 'target4: ' + target_data4; 
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;
            connection.send(target_all); 
        };
        document.getElementById("text-button3b").onclick = function() {
            target_data3 = target_data3 - 0.1;
            el_s3.innerHTML = 'target3: ' + target_data3;
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;
            connection.send(target_all); 
        };
        document.getElementById("text-button4b").onclick = function() {
            target_data4 = target_data4 - 0.1;
            el_s4.innerHTML = 'target4: ' + target_data4; 
            let target_all = target_data1 +','+ target_data2 +','+ target_data3 +','+ target_data4;
            connection.send(target_all); 
        };


   
    };
};

