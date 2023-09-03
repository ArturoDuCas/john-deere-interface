import numpy as np
import heapq
import random

def shortest_path(matrix, start, end):
    """
    This function finds the shortest path between two points in a matrix.
    
    :param matrix: 2D list of integers, the input matrix.
    :param start: tuple of integers, the starting point (i, j).
    :param end: tuple of integers, the ending point (i, j).
    :return: tuple, the minimum distance and the path as a list of points.
    """
    rows, cols = len(matrix), len(matrix[0])
    directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # Possible directions: right, down, left, up
    visited = [[False] * cols for _ in range(rows)]  # Matrix to track visited cells
    min_distance = [[float('inf')] * cols for _ in range(rows)]  # Matrix to store minimum distances
    min_distance[start[0]][start[1]] = 0
    pq = [(0, start)]  # Priority queue for distances
    paths = [[None] * cols for _ in range(rows)]  # Matrix to store paths
    
    while pq:
        current_distance, current_vertex = heapq.heappop(pq)  # Pop the vertex with the smallest distance
        
        # If the current vertex is the end, construct the path and return the result
        if current_vertex == end:
            path = []
            i, j = end
            while (i, j) != start:
                path.append((i, j))
                i, j = paths[i][j]
            path.append(start)
            path.reverse()
            return current_distance, path
        
        i, j = current_vertex
        if visited[i][j]:
            continue
        visited[i][j] = True
        
        # Check all possible directions
        for x, y in directions:
            ni, nj = i + x, j + y
            if 0 <= ni < rows and 0 <= nj < cols:
                distance = current_distance + 1
                if distance < min_distance[ni][nj]:
                    min_distance[ni][nj] = distance
                    heapq.heappush(pq, (distance, (ni, nj)))
                    paths[ni][nj] = (i, j)
                    
    return float('inf'), []  # Return infinity if no path is found

def tsp(matrix):
    """
    This function solves the Traveling Salesman Problem (TSP) for a matrix.
    
    :param matrix: 2D list of integers, the input matrix.
    :return: tuple, the minimum distance, the best order of points and the path.
    """
    points = [(i, j) for i in range(len(matrix)) for j in range(len(matrix[0])) if matrix[i][j] == 1]
    num_points = len(points)
    distance_matrix = [[0] * num_points for _ in range(num_points)]
    
    # Calculate the distances between all pairs of points
    for i in range(num_points):
        for j in range(i+1, num_points):
            distance, _ = shortest_path(matrix, points[i], points[j])
            distance_matrix[i][j] = distance_matrix[j][i] = distance
    
    min_distance = float('inf')
    best_order = None
    
    # Identify all the 1 points on the edges of the matrix
    border_points = [points[i] for i in range(num_points) if 
                     points[i][0] == 0 or 
                     points[i][1] == 0 or 
                     points[i][0] == len(matrix) - 1 or 
                     points[i][1] == len(matrix[0]) - 1]
    
    # Choose a random starting point from these points
    start_point = random.choice(border_points)
    start_index = points.index(start_point)
    
    visited = [False] * num_points
    visited[start_index] = True
    current_distance = 0
    order = [start_index]
    
    # Greedy algorithm to find the closest point to the current point
    while len(order) < num_points:
        next_point = None
        min_next_distance = float('inf')
        for j in range(num_points):
            if not visited[j] and distance_matrix[order[-1]][j] < min_next_distance:
                min_next_distance = distance_matrix[order[-1]][j]
                next_point = j
        current_distance += min_next_distance
        visited[next_point] = True
        order.append(next_point)
    
    # Complete the cycle and check if it's the best order
    current_distance += distance_matrix[order[-1]][order[0]]
    if current_distance < min_distance:
        min_distance = current_distance
        best_order = order
    
    # Construct the path
    path = [points[best_order[0]]]
    for i in range(1, len(best_order)):
        _, sub_path = shortest_path(matrix, points[best_order[i-1]], points[best_order[i]])
        path += sub_path[1:]
    
    return min_distance, [points[i] for i in best_order], path

matrix = [
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

min_distance, best_order, path = tsp(matrix)
print("Minimum distance:", min_distance)
print("Best order:", best_order)
print("Path:", path)