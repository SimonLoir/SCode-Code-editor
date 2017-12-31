exports.tokenize = function (language, text) {
    if(language == "js" || language == "javascript"){
        return this.tokenizeJs(text);
    }
}

exports.tokenizeJs = function (text) {
    let tokens = [];
    let buffer = "";
    let breakers = [';', ',', '=', '!', '.', '{', '}', '[', ']', '(', ')', '>', '<', "+", "-", "*", "/", ":", "&", " ", "\n", "\"", "'", "`"];
    let bad = [" ", "\n", "\"", "'", "`"];
    let reserved_keywords = ["abstract","arguments","await","boolean","break","byte","case","catch","char","class","const","continue","debugger","default","delete","do","double","else","enum","eval","export","extends","false","final","finally","float","for","function","goto","if","implements","import","in","instanceof","int","interface","let","long","native","new","null","package","private","protected","public","return","short","static","super","switch","synchronized","this","throw","throws","transient","true","try","typeof","var","void","volatile","while","with","yield"]

    for (const e of text) {
        if(breakers.indexOf(e) >= 0){
            if(buffer.trim() != ""){
                if(reserved_keywords.indexOf(buffer) >= 0){
                    tokens.push({
                        type: "Keyword",
                        value: buffer
                    });                    
                }else{
                    tokens.push({
                         type: "Identifier",
                         value: buffer   
                    });
                }
            }
            if(bad.indexOf(e) < 0){
                tokens.push({
                    type: "Punctuator",
                    value: e
                });
            }
            buffer = "";
        }else{
            buffer += e;
        }
    }
    return tokens;
}

