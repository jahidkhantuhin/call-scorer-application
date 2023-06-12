<template>
    <div style="width: 90px" >
        {{timeWithHHMMSS}}
    </div>
</template>

<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'

export default defineComponent({
    props: {
        time: String
    },
    setup(props) {
        const timeWithHHMMSS = computed(() => {
            if(props.time) {
                const p = ["h","m","s"];
                const sp = props.time.split(":").map((c,i) => {
                    if (+c === 0 && i === 0) {
                        return ``
                    }
                    return `${+c}${p[i]}`
                });
                return sp.join(" ");
            }
        })
        return {
            timeWithHHMMSS
        }
    },
})
</script>
