<template>
    <g className="bricks-layer">
        <brick-wall v-if="item" v-for="(item,index) in steelsList" :key="index" :x="item[1] * ITEM_SIZE_MAP.BRICK" :y="item[0] * ITEM_SIZE_MAP.BRICK"></brick-wall>
    </g>
</template>
<script>

import { ITEM_SIZE_MAP, N_MAP } from '../utils/constants'
import BrickWall from './BrickWall.vue'
export default {
    data() {
        return {
            x: 0,
            y: 0,
            ITEM_SIZE_MAP,
            N_MAP
        }
    },
    methods: {
        getRowCol(t, N) {
            return [Math.floor(t / N), t % N]
        }
    },
    mounted() {
    },
    computed: {
        bricks(){
            return this.$store.getters.bricks;
        },
        steelsList() {
            let array = [];
            this.bricks.forEach((set,t) => {
                if (set) {
                    const [row, col] = this. getRowCol(t, N_MAP.BRICK)
                    array.push([row, col]);
                } else {
                    array.push(false)
                }
            });
            return array;
        }
    },
    components: {
        BrickWall
    }

}
</script>
<style lang="less" scoped>

</style>
