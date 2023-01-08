import plugin from '../../../lib/plugins/plugin.js'
import console from 'console'
import axios from 'axios'
import fs from 'node:fs'
import YAML from 'yaml'
//此插件由[书辞千楪(1700179844)]编写，JD瞎jb乱搞了一下上传的
//模型的prompt文件请放到/Yunzai-Bot/resources/dhdata.txt
//如果没有dhdata.txt文件，请自行在/Yunzai-Bot/resources/内创建"dhdata.txt文件"。
//提问需要再resources里多放个那个wddata.txt
//续写只需加个空的xxdata.txt就行了
//有报错先看这里！！！！！！可能需要npm add axios -w后才能正常使用，看看简介有其他方式
//有问题问JD(1461072722)在上学回复慢，但是一定会回复，也可以去火火的群(666345141)里面找JD
const settings = await YAML.parse(fs.readFileSync('./plugins/welm-plugin/config/config.yaml','utf8'));
//如需配置插件请到本插件文件夹内config的config.yaml进行编辑
let bot_name =  settings.bot_name 
let API_token = settings.API_token 
let model = settings.model          
let max_tokens = settings.max_tokens
let max_tokens_xx = settings.max_tokens_xx    
let temperature = settings.temperature   
let top_p = settings.top_p         
let top_k = settings.top_k            
let n = settings.n                
let stop = settings.stop            
let twstop = settings.twstop
let commandstart = settings.xxcmdstart
let replystart = settings.xxreplystart
let priority = settings.xxpriority
//分割线_____________________________


export class RGznbot extends plugin {
    constructor() {
        super({
            name: 'WeLM续写',
            event: 'message',
            priority: priority,
            rule: [
                {
                    reg: '^续写.*',
                    fnc: 'Xuxie',
                }
            ]
        })
    }

	async Xuxie(e) {
        e.msg = e.msg.replace(commandstart, "")
        let sc_cs = fs.readFileSync('./plugins/welm-plugin/data/xxdata.txt', { encoding: 'utf-8' })
		let sc_cs2 = sc_cs + e.msg
        axios({
	        method: 'post',
	        url: 'https://welm.weixin.qq.com/v1/completions',
	        headers: {
		        "Content-Type": "application/json",
		        "Authorization": API_token
	        },
	        data: {
		        "prompt": sc_cs2,
		        "model": model,
		        "max_tokens": max_tokens_xx,
		        "temperature": temperature,
		        "top_p": top_p,
		        "top_k": top_k,
		        "n": n,
		        "stop": stop,
	        }
        })
		.then(function (respone) {
		    console.log(respone.data.choices[0]);
		    e.reply(replystart+respone.data.choices[0].text, e.isGroup);
		})          //如果不需要区分welm与其他ai插件的回复的话可以删掉 | "(welm提问)"+ | 这一部分
		.catch(function (error) {
		    console.log(error);
        }
    )}
}