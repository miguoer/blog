
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
            'js-core/es6-es10',	
            'js-core/easy-error',
         ]	
    },
    {	
        title:"函数式编程",	
        collapsable: false,	
        children:[	
            'function-program/function-program',
            'function-program/fp-functor'

        ]	
    },
    {	
        title:"手写系列",	
        collapsable: false,	
        children:[	
            'hand-write/hand-write',
            'hand-write/json',
            'hand-write/call',
            'hand-write/bind',
            'hand-write/extend',
            'hand-write/curry',
            'hand-write/promise',
            'hand-write/throttle',
            'hand-write/clone',
            'hand-write/instanceof',
            'hand-write/drag',
            'hand-write/settimeout',
            'hand-write/object',
            'hand-write/event',
            'hand-write/redux',
            'hand-write/koa',


         ]	
    },
    {	
        title:"Nodejs",	
        collapsable: false,	
        children:[	
            'nodejs/nodejs',
            'nodejs/http-cache',
            'nodejs/https',
            'nodejs/http-next'
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
    {	
        title:"微前端",	
        collapsable: false,	
        children:[	
            'micro-frontend/micro-frontend',	
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