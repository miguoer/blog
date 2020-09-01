
 web_front = [	
    {	
        title:"HTML核心知识",	
        collapsable: false,	
        children:[	
            'html-core/html-core',	
            'html-core/cross-origin'	

         ]	
    },	
    {	
        title:"JavaScript核心知识",	
        collapsable: false,	
        children:[	
            'js-core/js-core',	
            'js-core/this',	
            'js-core/closure',	
            'js-core/call&apply',	
            'js-core/prototype',	
            'js-core/reference',	

         ]	
    },	
    {	
        title:"前端工程化",	
        collapsable: false,	
        children:[	
            'engineering/engineering',	
            'engineering/build-tools',	
            'engineering/git',	
            'engineering/ci-cd',	
            'engineering/quality',	
            'engineering/test',	
        ]	
    },	
    {	
        title:"前端性能优化",	
        collapsable: false,	
        children:[	
            'performance/performance',	
            'performance/promote-deep',	
            'performance/webpack-promote',	

         ]	
    },	
    {	
        title:"框架源码理解",	
        collapsable: false,	
        children:[	
            'framework/framework',	
            'framework/framework-vue3',	
            'framework/framework-react',	
            'framework/framework-redux',	
            'framework/framework-vuex',	
            'framework/framework-webpack4',	
            'framework/framework-webpack5',	

         ]	
    },	

 ]	

 const algorithm = [	
    {	
        title:"leetcode",	
        collapsable: false,	
        children:[	
            'leetcode/leetcode',	
        ]	
    },	
]	

 const design_pattern = {	
    title:"设计模式",	
} 	

 const android = {	
    title:"安卓",	
} 	


 module.exports ={	
    "/web-front/":web_front,	
    "/algorithm/":algorithm	
} 