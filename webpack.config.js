
module.exports = {  
    entry: './node_modules/md5-base64/index.js',  //入口文件
    output: {  //输出文件路径设置
        path: __dirname,  
        filename: 'md5.js',  
    },  
    module: {  
        loaders: [{  
            test: /\.js$/,  
            exclude: /node_modules/,  
            loader: 'babel-loader'  
        }]  
    }  
} 