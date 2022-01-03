// while (goal != data.data) {
//     const currentPointId = data.data;
//     // console.log(currentPointId)
//     const currentPointData = pointData[currentPointId];
//     const currentPointConnectedLines = currentPointData.lines;
//     // 현재 포인트에 연결된 다음 포인트들 중 방문하지 않은 point를 heap에 넣어준다.
//     for (const lineId of currentPointConnectedLines) {
//         const [nextPointId] = lineData[lineId].points.filter(v => v !== currentPointId);
//         if (nextPointId == null || history.has(nextPointId)) {
//             continue;
//         }
//         if(this.per_click){
//             console.count('a')
//         }
//         // const polyline = new kakao.maps.Polyline({
//         //     path: lineData[lineId].linePath
//         // })

//         const nowX = this.circle.getPosition().getLat();
//         const nowY = this.circle.getPosition().getLng();
//         const lengthFromStartToFinish = ((nowX - goalx) ** 2 + (nowY - goaly) ** 2) ** 0.5;

//         // const roadLength = polyline.getLength();
//         heap.push({
//             data: nextPointId,
//             pre: currentPointId,
//             score: data.score + lengthFromStartToFinish
//         });
//         history.set(nextPointId, data);
//     }
//     // heap에 있는 후보중 가장 괜찮은 애를 뽑아온다.
//     data = heap.pop();
//     // console.log(data)
//     // 현재 포인트에서 다시 위 과정 반복
// }