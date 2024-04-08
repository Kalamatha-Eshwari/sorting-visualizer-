document.addEventListener('DOMContentLoaded', function () {
    const visualization = document.getElementById('visualization');
    const generateArrayBtn = document.getElementById('generate-array');
    const startSortingBtn = document.getElementById('start-sorting');
    const stopSortingBtn = document.getElementById('stop-sorting');
    const algorithmSelect = document.getElementById('algorithm');
    const speedSelect = document.getElementById('speed');
    let array = [];
    let sortingInProgress = false;
    let animationId;

    generateArrayBtn.addEventListener('click', generateArray);
    startSortingBtn.addEventListener('click', startSorting);
    stopSortingBtn.addEventListener('click', stopSorting);

    function generateArray() {
        if (sortingInProgress) return;
        array = [];
        for (let i = 0; i < 20; i++) { 
            array.push(Math.floor(Math.random() * 100) + 1);
        }
        drawArray(array);
    }

    function drawArray(array, sortingRange = []) {
        visualization.innerHTML = '';
        array.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.style.height = `${value}px`;
    
            let color;
            if (sortingRange.includes(index)) {
                color = '#f39f5a'; // Color for elements being swapped
            } else if (index < sortingRange[0]) {
                color = '#ee4c7c'; // Color for elements already sorted
            } else {
                color = '#1fbac0'; // Color for unsorted elements
            }
            bar.style.backgroundColor = color;
            visualization.appendChild(bar);
        });
    }

    function startSorting() {
        if (sortingInProgress) return;
        sortingInProgress = true;
        const selectedAlgorithm = algorithmSelect.value;
        const speed = getSpeed().value; // Get the speed value directly
        const swaps = [];

        if (selectedAlgorithm === 'bubble') {
            bubbleSort(array, speed, swaps);
        } else if (selectedAlgorithm === 'insertion') {
            insertionSort(array, speed, swaps);
        } else if (selectedAlgorithm === 'selection') {
            selectionSort(array, speed, swaps);
        } else if (selectedAlgorithm === 'merge') {
            mergeSort(array, speed);
        }
    }

    function stopSorting() {
        if (!sortingInProgress) return;
        cancelAnimationFrame(animationId);
        sortingInProgress = false;
    }

    function getSpeed() {
        const speed = speedSelect.value;
        switch (speed) {
            case '1': 
                return { value: 3000, description: 'Slow' };
            case '2': 
                return { value: 1000, description: 'Medium' };
            case '3': 
                return { value: 50, description: 'Fast' };
            default:
                return { value: 150, description: 'Medium' }; 
        }
    }

    function bubbleSort(arr, speed, swaps) {
        let n = arr.length;
        let i = 0;
        let animationInterval = setInterval(() => {
            let swapped = false;
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    let temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                    swaps.push(j);
                    swapped = true;
                }
            }
            drawArray(arr, [n - i - 1]);
            if (!swapped || !sortingInProgress) {
                clearInterval(animationInterval);
                sortingInProgress = false;
            }
            i++;
        }, speed);
    }
    
    function insertionSort(arr, speed, swaps) {
        let n = arr.length;
        let i = 1;
        let animationInterval = setInterval(() => {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                swaps.push(j + 1);
                j = j - 1;
            }
            arr[j + 1] = key;
            drawArray(arr, [i, ...swaps]);
            i++;
            if (i >= n || !sortingInProgress) {
                clearInterval(animationInterval);
                drawArray(arr);
                sortingInProgress = false;
            }
        }, speed);
    }
    
    
    

    function selectionSort(arr, speed, swaps) {
        let n = arr.length;
        let i = 0;
        let animationInterval = setInterval(() => {
            if (i >= n - 1 || !sortingInProgress) {
                clearInterval(animationInterval);
                drawArray(arr);
                sortingInProgress = false;
                return;
            }
    
            let minIndex = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIndex]) {
                    minIndex = j;
                }
            }
            if (minIndex !== i) {
                let temp = arr[i];
                arr[i] = arr[minIndex];
                arr[minIndex] = temp;
                swaps.push(minIndex);
                swaps.push(i);
            }
    
            drawArray(arr, [minIndex, i]);
            i++;
        }, speed);
    }
    

    async function mergeSort(arr, speed) {
        const merge = async (arr, l, m, r) => {
            let n1 = m - l + 1;
            let n2 = r - m;

            let L = new Array(n1);
            let R = new Array(n2);

            for (let i = 0; i < n1; i++)
                L[i] = arr[l + i];
            for (let j = 0; j < n2; j++)
                R[j] = arr[m + 1 + j];

            let i = 0;
            let j = 0;
            let k = l;

            while (i < n1 && j < n2) {
                if (L[i] <= R[j]) {
                    arr[k] = L[i];
                    i++;
                } else {
                    arr[k] = R[j];
                    j++;
                }
                k++;
                await waitforme(speed);
                drawArray(arr, [k - 1]);
            }

            while (i < n1) {
                arr[k] = L[i];
                i++;
                k++;
                await waitforme(speed);
                drawArray(arr, [k - 1]);
            }

            while (j < n2) {
                arr[k] = R[j];
                j++;
                k++;
                await waitforme(speed);
                drawArray(arr, [k - 1]);
            }
        }

        const mergeSortHelper = async (arr, l, r) => {
            if (l >= r) {
                return;
            }
            let m = l + Math.floor((r - l) / 2);
            await mergeSortHelper(arr, l, m);
            await mergeSortHelper(arr, m + 1, r);
            await merge(arr, l, m, r);
        }

        await mergeSortHelper(arr, 0, arr.length - 1);
        sortingInProgress = false;
    }

    function waitforme(delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, delay);
        });
    }
});
