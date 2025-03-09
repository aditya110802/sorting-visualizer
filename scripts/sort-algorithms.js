"use strict";
class sortAlgorithms {
    constructor(time) {
        this.list = document.querySelectorAll(".cell");
        this.size = this.list.length;
        this.time = time;
        this.help = new Helper(this.time, this.list);
    }

    // BUBBLE SORT
    BubbleSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            for(let j = 0 ; j < this.size - i - 1 ; ++j) {
                await this.help.mark(j);
                await this.help.mark(j+1);
                if(await this.help.compare(j, j+1)) {
                    await this.help.swap(j, j+1);
                }
                await this.help.unmark(j);
                await this.help.unmark(j+1);
            }
            this.list[this.size - i - 1].setAttribute("class", "cell done");
        }
        this.list[0].setAttribute("class", "cell done");
    }

    // INSERTION SORT
    InsertionSort = async () => {
        for(let i = 0 ; i < this.size - 1 ; ++i) {
            let j = i;
            while(j >= 0 && await this.help.compare(j, j+1)) {
                await this.help.mark(j);
                await this.help.mark(j+1);
                await this.help.pause();
                await this.help.swap(j, j+1);
                await this.help.unmark(j);
                await this.help.unmark(j+1);
                j -= 1;
            }
        }
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    // SELECTION SORT
    SelectionSort = async () => {
        for(let i = 0 ; i < this.size ; ++i) {
            let minIndex = i;
            for(let j = i ; j < this.size ; ++j) {
                await this.help.markSpl(minIndex);
                await this.help.mark(j);
                if(await this.help.compare(minIndex, j)) {
                    await this.help.unmark(minIndex);
                    minIndex = j;
                }
                await this.help.unmark(j);
                await this.help.markSpl(minIndex);
            }
            await this.help.mark(minIndex);
            await this.help.mark(i);
            await this.help.pause();
            await this.help.swap(minIndex, i);
            await this.help.unmark(minIndex);
            this.list[i].setAttribute("class", "cell done");
        }
    }

    // MERGE SORT
    MergeSort = async () => {
        await this.MergeDivider(0, this.size - 1);
        for(let counter = 0 ; counter < this.size ; ++counter) {
            this.list[counter].setAttribute("class", "cell done");
        }
    }

    MergeDivider = async (start, end) => {
        if(start < end) {
            let mid = start + Math.floor((end - start)/2);
            await this.MergeDivider(start, mid);
            await this.MergeDivider(mid+1, end);
            await this.Merge(start, mid, end);
        }
    }

    Merge = async (start, mid, end) => {
        let newList = new Array();
        let frontcounter = start;
        let midcounter = mid + 1;
        
        while(frontcounter <= mid && midcounter <= end) {
            let fvalue = Number(this.list[frontcounter].getAttribute("value"));
            let svalue = Number(this.list[midcounter].getAttribute("value"));
            if(fvalue >= svalue) {
                newList.push(svalue);
                ++midcounter;
            }
            else {
                newList.push(fvalue);
                ++frontcounter;
            }
        }
        while(frontcounter <= mid) {
            newList.push(Number(this.list[frontcounter].getAttribute("value")));
            ++frontcounter;
        }
        while(midcounter <= end) {
            newList.push(Number(this.list[midcounter].getAttribute("value")));
            ++midcounter;
        }

        for(let c = start ; c <= end ; ++c) {
            this.list[c].setAttribute("class", "cell current");
        }
        for(let c = start, point = 0 ; c <= end && point < newList.length; 
            ++c, ++point) {
                await this.help.pause();
                this.list[c].setAttribute("value", newList[point]);
                this.list[c].style.height = `${3.5*newList[point]}px`;
        }
        for(let c = start ; c <= end ; ++c) {
            this.list[c].setAttribute("class", "cell");
        }
    }

    // QUICK SORT
    QuickSort = async () => {
        await this.QuickDivider(0, this.size-1);
        for(let c = 0 ; c < this.size ; ++c) {
            this.list[c].setAttribute("class", "cell done");
        }
    }

    QuickDivider = async (start, end) => {
        if(start < end) {
            let pivot = await this.Partition(start, end);
            await this.QuickDivider(start, pivot-1);
            await this.QuickDivider(pivot+1, end);
        }
    }

    Partition = async (start, end) => {
        let pivot = this.list[end].getAttribute("value");
        let prev_index = start - 1;

        await this.help.markSpl(end);
        for(let c = start ; c < end ; ++c) {
            let currValue = Number(this.list[c].getAttribute("value"));
            await this.help.mark(c);
            if(currValue < pivot) {
                prev_index += 1;
                await this.help.mark(prev_index);
                await this.help.swap(c, prev_index);
                await this.help.unmark(prev_index);
            }
            await this.help.unmark(c);
        }
        await this.help.swap(prev_index+1, end);
        await this.help.unmark(end);
        return prev_index + 1;
    }
    

    // HEAP SORT (Ascending Order)
HeapSort = async () => {
    // Build a min heap (smallest element at root)
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
        await this.Heapify(this.size, i);
    }

    // Extract elements from the heap one by one
    for (let i = this.size - 1; i > 0; i--) {
        await this.help.swap(0, i);
        this.list[i].setAttribute("class", "cell done"); // Mark sorted
        await this.Heapify(i, 0); // Re-heapify the reduced heap
    }
    this.list[0].setAttribute("class", "cell done");
};

// Min Heapify function to maintain min heap property
Heapify = async (n, i) => {
    let smallest = i; // Root
    let left = 2 * i + 1;
    let right = 2 * i + 2;

    if (left < n && !(await this.help.compare(smallest, left))) {
        smallest = left;
    }
    if (right < n && !(await this.help.compare(smallest, right))) {
        smallest = right;
    }

    if (smallest !== i) {
        await this.help.swap(i, smallest);
        await this.Heapify(n, smallest);
    }
};


// // HEAP SORT (Descending Order[as it is max heap generally])
// HeapSort = async () => {
//     for (let i = Math.floor(this.size / 2) - 1; i >= 0; i--) {
//         await this.Heapify(this.size, i);
//     }

//     for (let i = this.size - 1; i > 0; i--) {
//         await this.help.swap(0, i);
//         this.list[i].setAttribute("class", "cell done");
//         await this.Heapify(i, 0);
//     }
//     this.list[0].setAttribute("class", "cell done");
// };

// Heapify = async (n, i) => {
//     let largest = i;
//     let left = 2 * i + 1;
//     let right = 2 * i + 2;

//     if (left < n && await this.help.compare(largest, left)) {
//         largest = left;
//     }
//     if (right < n && await this.help.compare(largest, right)) {
//         largest = right;
//     }
    
//     if (largest !== i) {
//         await this.help.swap(i, largest);
//         await this.Heapify(n, largest);
//     }
// };


   

// Heap Sort for large depth cases
heapSortIntro = async (start, end) => {
    let size = end - start + 1;

    // Build a max heap
    for (let i = Math.floor(size / 2) - 1; i >= 0; i--) {
        await this.heapify(size, i, start);
    }

    // Extract elements one by one
    for (let i = size - 1; i > 0; i--) {
        await this.help.swap(start, start + i);
        await this.heapify(i, 0, start);
    }
};

// Heapify function for heap sort
heapify = async (size, root, offset) => {
    let largest = root;
    let left = 2 * root + 1;
    let right = 2 * root + 2;

    if (left < size && (await this.help.compare(offset + largest, offset + left))) {
        largest = left;
    }
    if (right < size && (await this.help.compare(offset + largest, offset + right))) {
        largest = right;
    }

    if (largest !== root) {
        await this.help.swap(offset + root, offset + largest);
        await this.heapify(size, largest, offset);
    }
};

 // SHELL SORT
 ShellSort = async () => {
    let gap = Math.floor(this.size / 2);

    while (gap > 0) {
        for (let i = gap; i < this.size; i++) {
            let j = i;
            while (j >= gap && (await this.help.compare(j - gap, j))) {
                await this.help.mark(j);
                await this.help.mark(j - gap);
                await this.help.swap(j, j - gap);
                await this.help.unmark(j);
                await this.help.unmark(j - gap);
                j -= gap;
            }
        }
        gap = Math.floor(gap / 2);
    }

    // Mark all elements as sorted
    for (let counter = 0; counter < this.size; counter++) {
        this.list[counter].setAttribute("class", "cell done");
    }
};

// TIM SORT
TimSort = async () => {
    const RUN = 32; // Run size used for insertion sort

    // Sort small subarrays using Insertion Sort
    for (let i = 0; i < this.size; i += RUN) {
        await this.insertionSortTim(i, Math.min(i + RUN - 1, this.size - 1));
    }

    // Merge sorted subarrays using Merge Sort logic
    for (let size = RUN; size < this.size; size = 2 * size) {
        for (let left = 0; left < this.size; left += 2 * size) {
            let mid = left + size - 1;
            let right = Math.min(left + 2 * size - 1, this.size - 1);
            if (mid < right) {
                await this.Merge(left, mid, right);
            }
        }
    }

    // Mark all elements as sorted
    for (let counter = 0; counter < this.size; counter++) {
        this.list[counter].setAttribute("class", "cell done");
    }
};

// Insertion Sort for small subarrays in Tim Sort
insertionSortTim = async (left, right) => {
    for (let i = left + 1; i <= right; i++) {
        let j = i;
        while (j > left && (await this.help.compare(j - 1, j))) {
            await this.help.mark(j);
            await this.help.mark(j - 1);
            await this.help.swap(j, j - 1);
            await this.help.unmark(j);
            await this.help.unmark(j - 1);
            j--;
        }
    }
};


// INTROSORT
IntroSort = async () => {
    let depthLimit = 2 * Math.floor(Math.log2(this.size));
    await this.introSortUtil(0, this.size - 1, depthLimit);

    // Mark all elements as sorted
    for (let counter = 0; counter < this.size; counter++) {
        this.list[counter].setAttribute("class", "cell done");
    }
};

// Utility function for IntroSort
introSortUtil = async (start, end, depthLimit) => {
    let size = end - start + 1;

    if (size < 16) {
        await this.insertionSortIntro(start, end);
        return;
    }

    if (depthLimit === 0) {
        await this.heapSortIntro(start, end);
        return;
    }

    let pivot = await this.Partition(start, end);
    await this.introSortUtil(start, pivot - 1, depthLimit - 1);
    await this.introSortUtil(pivot + 1, end, depthLimit - 1);
};

// Insertion Sort for small subarrays
insertionSortIntro = async (left, right) => {
    for (let i = left + 1; i <= right; i++) {
        let j = i;
        while (j > left && (await this.help.compare(j - 1, j))) {
            await this.help.mark(j);
            await this.help.mark(j - 1);
            await this.help.swap(j, j - 1);
            await this.help.unmark(j);
            await this.help.unmark(j - 1);
            j--;
        }
    }
};

// COUNTING SORT
CountingSort = async () => {
    let max = 0;
    let min = Infinity;
    let size = this.size;
    
    // Find max and min value in the list
    for (let i = 0; i < size; i++) {
        let value = Number(this.list[i].getAttribute("value"));
        max = Math.max(max, value);
        min = Math.min(min, value);
    }

    let range = max - min + 1;
    let count = new Array(range).fill(0);
    let output = new Array(size).fill(0);

    // Count occurrences of each number
    for (let i = 0; i < size; i++) {
        let value = Number(this.list[i].getAttribute("value"));
        count[value - min]++;
        await this.help.mark(i);
        await this.help.pause();
        await this.help.unmark(i);
    }

    // Compute prefix sum (cumulative count)
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
    }

    // Build the sorted output array
    for (let i = size - 1; i >= 0; i--) {
        let value = Number(this.list[i].getAttribute("value"));
        let index = count[value - min] - 1;
        output[index] = value;
        count[value - min]--;
        await this.help.mark(i);
        await this.help.pause();
        await this.help.unmark(i);
    }

    // Place sorted values back into the list
    for (let i = 0; i < size; i++) {
        this.list[i].setAttribute("value", output[i]);
        this.list[i].style.height = `${3.8 * output[i]}px`;
        this.list[i].setAttribute("class", "cell done");
        await this.help.pause();
    }
};


// RADIX SORT
RadixSort = async () => {
    let max = 0;
    let size = this.size;

    // Find the maximum number to determine the number of digits
    for (let i = 0; i < size; i++) {
        let value = Number(this.list[i].getAttribute("value"));
        max = Math.max(max, value);
    }

    // Apply counting sort to each digit (LSD to MSD)
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await this.CountingSortForRadix(exp);
    }

    // Mark all as sorted
    for (let i = 0; i < size; i++) {
        this.list[i].setAttribute("class", "cell done");
    }
};

// Helper function: Counting Sort for Radix Sort
CountingSortForRadix = async (exp) => {
    let size = this.size;
    let output = new Array(size).fill(0);
    let count = new Array(10).fill(0);

    // Count occurrences of each digit
    for (let i = 0; i < size; i++) {
        let value = Number(this.list[i].getAttribute("value"));
        let digit = Math.floor(value / exp) % 10;
        count[digit]++;
        await this.help.mark(i);
        await this.help.pause();
        await this.help.unmark(i);
    }

    // Compute prefix sum
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Build sorted output array
    for (let i = size - 1; i >= 0; i--) {
        let value = Number(this.list[i].getAttribute("value"));
        let digit = Math.floor(value / exp) % 10;
        let index = count[digit] - 1;
        output[index] = value;
        count[digit]--;
        await this.help.mark(i);
        await this.help.pause();
        await this.help.unmark(i);
    }

    // Update the list with sorted values for this digit place
    for (let i = 0; i < size; i++) {
        this.list[i].setAttribute("value", output[i]);
        this.list[i].style.height = `${3.8 * output[i]}px`;
        await this.help.pause();
    }
};

// BUCKET SORT
BucketSort = async () => {
    let size = this.size;
    if (size <= 0) return;

    let max = 0, min = 100;
    let bucketCount = Math.ceil(Math.sqrt(size)); // Number of buckets
    let buckets = Array.from({ length: bucketCount }, () => []);

    // Find max and min values to determine bucket ranges
    for (let i = 0; i < size; i++) {
        let value = Number(this.list[i].getAttribute("value"));
        max = Math.max(max, value);
        min = Math.min(min, value);
    }

    let range = Math.ceil((max - min + 1) / bucketCount); // Range of each bucket

    // Distribute elements into buckets
    for (let i = 0; i < size; i++) {
        let value = Number(this.list[i].getAttribute("value"));
        let bucketIndex = Math.floor((value - min) / range);
        buckets[bucketIndex].push(value);
        await this.help.mark(i);
        await this.help.pause();
        await this.help.unmark(i);
    }

    // Sort each bucket and merge
    let index = 0;
    for (let bucket of buckets) {
        bucket.sort((a, b) => a - b); // Using JavaScript's built-in sort
        for (let value of bucket) {
            this.list[index].setAttribute("value", value);
            this.list[index].style.height = `${3.8 * value}px`;
            await this.help.mark(index);
            await this.help.pause();
            await this.help.unmark(index);
            index++;
        }
    }

    // Mark all as sorted
    for (let i = 0; i < size; i++) {
        this.list[i].setAttribute("class", "cell done");
    }
};




};