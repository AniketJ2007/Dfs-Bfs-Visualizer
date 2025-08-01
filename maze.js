let start_btn = document.getElementById('start')
let len, heig
let method = ''
let message = document.getElementById("msg")
document.getElementById('bfs').addEventListener('click', function () {
    if (method === 'dfs') document.getElementById('dfs').style.backgroundColor = ''
    method = 'bfs'
    document.getElementById('bfs').style.backgroundColor = 'red'
})
document.getElementById('dfs').addEventListener('click', function () {
    if (method === 'bfs') document.getElementById('bfs').style.backgroundColor = ''
    method = 'dfs'
    document.getElementById('dfs').style.backgroundColor = 'red'
})
start_btn.addEventListener('click', function () {
    if (method === '') {
        message.innerText = "Select Either BFS OR DFS"
        return;
    }
    len = Number(document.getElementById('length').innerText)
    heig = Number(document.getElementById('width').innerText)
    if (isNaN(len) || isNaN(heig) || len < 1 || heig < 1) {
        message.innerText = `Give valid values of Length And Height`
        return;
    }
    document.getElementById('start_screen').style.display = 'none'
    document.getElementById('main').style.display = 'flex'

    console.log(`${len} ${heig} `);
    for (let i = 0; i < Number(heig); i++) {
        let r1 = document.getElementById('tab')
        let c = document.createElement('tr')
        c.id = 'r' + i.toString() + '0'
        r1.append(c)
    }
    console.log(document.getElementsByTagName('table'));

    for (let c = 0; c < Number(heig); c++) {
        for (let i = 0; i < Number(len); i++) {
            let r1 = document.getElementById('r' + c.toString() + '0')
            let cd = document.createElement('td')
            cd.id = c.toString() + i.toString()
            r1.append(cd)
        }
    }
    console.log(document.getElementsByTagName('table'));
    let board = []
    for (let i = 0; i < heig; i++) {
        let c = []
        for (let j = 0; j < len; j++) {
            c.push(0)
        }
        board.push(c)
    }
    console.log(board);
    let placing_wall = false;
    function setwalls() {
        for (let i = 0; i < heig; i++) {
            for (let j = 0; j < len; j++) {
                let id = i.toString() + j.toString()
                let element = document.getElementById(id)
                element.addEventListener('click', function () {
                    if (placing_wall) {
                        board[i][j] = 1;
                        element.style.backgroundColor = 'gray'
                    }
                })
            }
        }
    }
    document.getElementById('wall').addEventListener('click', function () {
        placing_wall = true;
    })

    document.getElementById('stop_wall').addEventListener('click', function () {
        placing_wall = false;
    })
    setwalls()
    let start_pt = null
    let end_pt = null
    let start_select = false;
    let end_select = false;
    // function set_start(){
    //  for (let i = 0; i < heig; i++) {
    //         for (let j = 0; j < len; j++) {
    //             let id = i.toString() + j.toString()
    //             let element = document.getElementById(id)
    //             element.addEventListener('click', function () {
    //                 if(start_select) return;
    //                 start_pt=[i,j]
    //                 element.style.backgroundColor='blue'
    //                 console.log(start_pt);
    //             })
    //         }
    //     }
    // }
    document.getElementById('start_pt').addEventListener('click', function () {
        if (start_select) return;
        for (let i = 0; i < heig; i++) {
            for (let j = 0; j < len; j++) {
                let id = i.toString() + j.toString()
                let element = document.getElementById(id)
                element.addEventListener('click', function () {
                    if (start_select) return;
                    start_pt = [i, j]
                    element.style.backgroundColor = 'blue'
                    console.log(start_pt);
                    start_select = true
                })
            }
        }
    })
    document.getElementById('end_pt').addEventListener('click', function () {
        if (end_select) return;
        for (let i = 0; i < heig && end_select === false; i++) {
            for (let j = 0; j < len && end_select === false; j++) {
                let id = i.toString() + j.toString()
                let element = document.getElementById(id)
                element.addEventListener('click', function () {
                    if (end_select) return;
                    end_pt = [i, j]
                    element.style.backgroundColor = 'pink'
                    console.log(end_pt);
                    end_select = true
                })
            }
        }
    })



    let path_bfs = [];
    let coll_shortest_paths = []
    const rows = board.length;
    const cols = board[0].length;
    let dx = [0, -1, 0, 1];
    let dy = [1, 0, -1, 0];
    const visited = board.map(row => row.slice());
    const map = {}
    function bfs() {
        let q = [[...start_pt]]
        while (q.length !== 0) {
            let temp = []
            let n = q.length
            for (let i = 0; i < n; i++) {
                let [r, c] = q.shift()
                for (let k = 0; k < 4; k++) {
                    let nr = r + dx[k]
                    let nc = c + dy[k]
                    if (nr === end_pt[0] && nc === end_pt[1]) {
                        path_bfs.push([end_pt])
                        return;
                    }
                    if (nr >= 0 && nr < heig && nc >= 0 && nc < heig && board[nr][nc] === 0 && !visited[nr][nc]) {
                        visited[nr][nc] = 1;
                        q.push([nr, nc])
                        temp.push([nr, nc])
                        map[nr, nr] = { r, c }
                    }
                }
            }
            if (temp.length) path_bfs.push([...temp])
        }
    }
    let path_dfs = []
    function dfs(r, c, dfs_ind_path) {
        if (r === end_pt[0] && c === end_pt[1]) {
            dfs_ind_path.push([r, c])
            path_dfs.push({ type: 'cell', square: [r, c] })
            path_dfs.push({ type: 'path', way: [...dfs_ind_path] })
            dfs_ind_path.pop()
            return;
        }
        if (visited[r][c] === 1) return;
        visited[r][c] = 1
        dfs_ind_path.push([r, c])
        path_dfs.push({ type: 'cell', square: [r, c] })
        for (let k = 0; k < 4; k++) {
            let nr = r + dx[k];
            let nc = c + dy[k];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                board[nr][nc] === 0 && visited[nr][nc] === 0) {
                dfs(nr, nc, dfs_ind_path);
            }

        }
        path_dfs.push({ type: 'backtrack', square: [r, c] })
        dfs_ind_path.pop()
    }
    let delay_dfs = 0
    function animate_dfs() {
        for (let p = 0; p < path_dfs.length; p++) {
            setTimeout(function () {
                if (path_dfs[p].type === 'cell') {
                    const [r, c] = path_dfs[p].square
                    let id = r.toString() + c.toString()
                    let element = document.getElementById(id)
                    element.style.backgroundColor = 'red'
                }
                else if (path_dfs[p].type === 'backtrack') {
                    const [r, c] = path_dfs[p].square
                    let id = r.toString() + c.toString()
                    let element = document.getElementById(id)
                    element.style.backgroundColor = 'lightgray'
                }
                else if (path_dfs[p].type === 'path') {
                    for (let i = 0; i < path_dfs[p].way.length; i++) {
                        const [r, c] = path_dfs[p].way[i]
                        let id = r.toString() + c.toString()
                        let element = document.getElementById(id)
                        element.style.backgroundColor = 'green'
                    }
                }
            }, delay_dfs)
            delay_dfs += 700
        }
    }
    document.getElementById('start_game').addEventListener('click', function () {
        let delay = 0;
        if (start_select && end_select) {
            if (method === 'bfs') {
                bfs()
                for (let i = 0; i < path_bfs.length; i++) {
                    setTimeout(function () {
                        for (let j = 0; j < path_bfs[i].length; j++) {
                            let [r, c, parent] = path_bfs[i][j]

                            let id = r.toString() + c.toString()
                            let element = document.getElementById(id)
                            element.style.backgroundColor = ''
                            element.className = 'animation_class'

                        }
                    }, delay)
                    delay += 1000
                }
            }
            else {
                let [s0, s1] = start_pt
                dfs(s0, s1, [])
                animate_dfs()
            }
            console.log(path_bfs);


        }
    })




})
