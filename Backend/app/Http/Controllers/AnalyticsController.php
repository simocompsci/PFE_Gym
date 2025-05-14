<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Models\Client;
use App\Models\GymProduct;

class AnalyticsController extends Controller
{
    /**
     * Get monthly revenue breakdown for the last 6 months
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getRevenueData()
    {
        try {
            // Get the current date and calculate the date 6 months ago
            $endDate = Carbon::now();
            $startDate = Carbon::now()->subMonths(5)->startOfMonth();

            // Combine the data into a monthly breakdown
            $monthlyData = [];

            // Initialize the array with all months and add sample data
            for ($i = 0; $i < 6; $i++) {
                $date = Carbon::now()->subMonths(5 - $i)->startOfMonth();
                $monthName = $date->format('F');
                $year = $date->year;

                // Generate sample revenue data that increases each month
                // This is just for demonstration purposes
                $baseRevenue = 5000 + ($i * 1000); // Start at 5000 and increase by 1000 each month
                $randomFactor = rand(85, 115) / 100; // Random factor between 0.85 and 1.15
                $revenue = $baseRevenue * $randomFactor;

                // Add some seasonal variation - higher in winter months (December, January)
                $month = $date->month;
                if ($month == 12 || $month == 1) {
                    $revenue *= 1.3; // 30% boost in winter months
                } elseif ($month == 6 || $month == 7) {
                    $revenue *= 1.2; // 20% boost in summer months
                }

                $monthlyData[$i] = [
                    'month' => $monthName,
                    'year' => $year,
                    'revenue' => round($revenue, 2),
                    'expenses' => round($revenue * 0.6, 2) // Expenses are 60% of revenue
                ];
            }

            // For testing purposes, we'll use the sample data
            // In a production environment, you would uncomment this code to use real data

            /*
            // Try to get real data if available
            try {
                // Query for membership revenue
                $membershipRevenue = DB::table('client_memberships')
                    ->join('clients', 'client_memberships.client_id', '=', 'clients.id')
                    ->join('membership_plans', 'client_memberships.membership_plan_id', '=', 'membership_plans.id')
                    ->select(
                        DB::raw('YEAR(client_memberships.created_at) as year'),
                        DB::raw('MONTH(client_memberships.created_at) as month'),
                        DB::raw('SUM(membership_plans.price) as revenue')
                    )
                    ->where('client_memberships.created_at', '>=', $startDate)
                    ->where('clients.is_active', true)
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

                // Query for product sales revenue
                $productRevenue = DB::table('product_sales')
                    ->select(
                        DB::raw('YEAR(sale_date) as year'),
                        DB::raw('MONTH(sale_date) as month'),
                        DB::raw('SUM(total_amount) as revenue')
                    )
                    ->where('sale_date', '>=', $startDate)
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

                // If we have real data, use it instead of sample data
                if (count($membershipRevenue) > 0 || count($productRevenue) > 0) {
                    // Reset the monthly data to zeros
                    foreach ($monthlyData as &$data) {
                        $data['revenue'] = 0;
                        $data['expenses'] = 0;
                    }

                    // Add membership revenue
                    foreach ($membershipRevenue as $revenue) {
                        $index = $this->getMonthIndex($revenue->year, $revenue->month);
                        if ($index !== false && isset($monthlyData[$index])) {
                            $monthlyData[$index]['revenue'] += $revenue->revenue;
                        }
                    }

                    // Add product revenue
                    foreach ($productRevenue as $revenue) {
                        $index = $this->getMonthIndex($revenue->year, $revenue->month);
                        if ($index !== false && isset($monthlyData[$index])) {
                            $monthlyData[$index]['revenue'] += $revenue->revenue;
                        }
                    }

                    // Calculate expenses (60% of revenue)
                    foreach ($monthlyData as &$data) {
                        $data['expenses'] = round($data['revenue'] * 0.6, 2);
                        $data['revenue'] = round($data['revenue'], 2);
                    }
                }
            } catch (\Exception $e) {
                // If there's an error getting real data, we'll just use the sample data
                // No need to do anything here as we already have sample data
            }
            */

            return response()->json([
                'success' => true,
                'data' => array_values($monthlyData)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve revenue data',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Get membership distribution data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMembershipDistribution()
    {
        try {
            // Create sample data for demonstration
            $sampleData = [
                ['plan' => 'Gold', 'members' => 45],
                ['plan' => 'Silver', 'members' => 78],
                ['plan' => 'Bronze', 'members' => 120],
                ['plan' => 'Platinum', 'members' => 22]
            ];

            // For testing purposes, we'll use the sample data
            // In a production environment, you would uncomment this code to use real data

            /*
            // Try to get real data if available
            try {
                $membershipData = DB::table('client_memberships')
                    ->join('clients', 'client_memberships.client_id', '=', 'clients.id')
                    ->join('membership_plans', 'client_memberships.membership_plan_id', '=', 'membership_plans.id')
                    ->select('membership_plans.name as membership', DB::raw('COUNT(*) as count'))
                    ->where('clients.is_active', true)
                    ->where('client_memberships.status', 'active')
                    ->groupBy('membership_plans.name')
                    ->get();

                // If we have real data, use it instead of sample data
                if (count($membershipData) > 0) {
                    // Format the data for the frontend
                    $formattedData = [];
                    foreach ($membershipData as $membership) {
                        $formattedData[] = [
                            'plan' => $membership->membership,
                            'members' => $membership->count
                        ];
                    }

                    return response()->json([
                        'success' => true,
                        'data' => $formattedData
                    ]);
                }
            } catch (\Exception $e) {
                // If there's an error getting real data, we'll just use the sample data
            }
            */

            // Use sample data if no real data is available
            return response()->json([
                'success' => true,
                'data' => $sampleData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve membership distribution data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get age group distribution of clients
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAgeDistribution()
    {
        try {
            // Create sample data for demonstration
            $sampleData = [
                ['ageGroup' => '18-24', 'members' => 42],
                ['ageGroup' => '25-34', 'members' => 78],
                ['ageGroup' => '35-44', 'members' => 65],
                ['ageGroup' => '45-54', 'members' => 38],
                ['ageGroup' => '55+', 'members' => 22]
            ];

            // For testing purposes, we'll use the sample data
            // In a production environment, you would uncomment this code to use real data

            /*
            // Try to get real data if available
            try {
                // Get all active clients with their birth date
                $clients = Client::where('is_active', true)->get();

                // If we have clients, calculate real age distribution
                if (count($clients) > 0) {
                    // Define age groups
                    $ageGroups = [
                        '18-24' => 0,
                        '25-34' => 0,
                        '35-44' => 0,
                        '45-54' => 0,
                        '55+' => 0
                    ];

                    // Calculate age for each client and increment the appropriate age group
                    foreach ($clients as $client) {
                        // Skip clients without birth date
                        if (!$client->birth_date) {
                            continue;
                        }

                        $age = Carbon::parse($client->birth_date)->age;

                        if ($age < 18) {
                            // Skip clients under 18
                            continue;
                        } elseif ($age <= 24) {
                            $ageGroups['18-24']++;
                        } elseif ($age <= 34) {
                            $ageGroups['25-34']++;
                        } elseif ($age <= 44) {
                            $ageGroups['35-44']++;
                        } elseif ($age <= 54) {
                            $ageGroups['45-54']++;
                        } else {
                            $ageGroups['55+']++;
                        }
                    }

                    // Check if we have any data in the age groups
                    $hasData = false;
                    foreach ($ageGroups as $count) {
                        if ($count > 0) {
                            $hasData = true;
                            break;
                        }
                    }

                    // If we have real data, format it for the frontend
                    if ($hasData) {
                        $formattedData = [];
                        foreach ($ageGroups as $group => $count) {
                            $formattedData[] = [
                                'ageGroup' => $group,
                                'members' => $count
                            ];
                        }

                        return response()->json([
                            'success' => true,
                            'data' => $formattedData
                        ]);
                    }
                }
            } catch (\Exception $e) {
                // If there's an error getting real data, we'll just use the sample data
            }
            */

            // Use sample data if no real data is available
            return response()->json([
                'success' => true,
                'data' => $sampleData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve age distribution data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get product sales data
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProductSales()
    {
        try {
            // Create sample data for demonstration
            $sampleData = [
                ['product' => 'Protein Powder', 'sales' => 145],
                ['product' => 'Resistance Bands', 'sales' => 98],
                ['product' => 'Gym Gloves', 'sales' => 87],
                ['product' => 'Shaker Bottle', 'sales' => 76],
                ['product' => 'Gym Towel', 'sales' => 65]
            ];

            // For testing purposes, we'll use the sample data
            // In a production environment, you would uncomment this code to use real data

            /*
            // Try to get real data if available
            try {
                // Get top selling products
                $productSales = DB::table('product_sales')
                    ->join('gym_products', 'product_sales.product_id', '=', 'gym_products.id')
                    ->select(
                        'gym_products.name as product',
                        DB::raw('SUM(product_sales.quantity) as sales')
                    )
                    ->groupBy('gym_products.name')
                    ->orderBy('sales', 'desc')
                    ->limit(5)
                    ->get();

                // If we have real data, use it instead of sample data
                if (count($productSales) > 0) {
                    return response()->json([
                        'success' => true,
                        'data' => $productSales
                    ]);
                }
            } catch (\Exception $e) {
                // If there's an error getting real data, we'll just use the sample data
            }
            */

            // Use sample data if no real data is available
            return response()->json([
                'success' => true,
                'data' => $sampleData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve product sales data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get monthly profit margin percentage
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfitMargins()
    {
        try {
            // Initialize the array with all months and sample data
            $profitMargins = [];
            for ($i = 0; $i < 6; $i++) {
                $date = Carbon::now()->subMonths(5 - $i)->startOfMonth();
                $monthName = $date->format('F');
                $year = $date->year;

                // Generate sample margin data that varies each month
                // This is just for demonstration purposes
                $baseMargin = 35 + ($i * 1.5); // Start at 35% and increase slightly each month
                $randomFactor = rand(90, 110) / 100; // Random factor between 0.9 and 1.1
                $margin = $baseMargin * $randomFactor;

                $profitMargins[$i] = [
                    'month' => $monthName,
                    'year' => $year,
                    'margin' => round($margin, 1)
                ];
            }

            // For testing purposes, we'll use the sample data
            // In a production environment, you would uncomment this code to use real data

            /*
            // Try to get real data if available
            try {
                // Calculate the date 6 months ago
                $startDate = Carbon::now()->subMonths(5)->startOfMonth();

                // Get monthly revenue and cost data
                $monthlySales = DB::table('product_sales')
                    ->select(
                        DB::raw('YEAR(sale_date) as year'),
                        DB::raw('MONTH(sale_date) as month'),
                        DB::raw('SUM(total_amount) as revenue')
                    )
                    ->where('sale_date', '>=', $startDate)
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

                // Get product costs for the same period
                $productCosts = DB::table('product_sales')
                    ->join('gym_products', 'product_sales.product_id', '=', 'gym_products.id')
                    ->select(
                        DB::raw('YEAR(sale_date) as year'),
                        DB::raw('MONTH(sale_date) as month'),
                        DB::raw('SUM(product_sales.quantity * gym_products.cost) as cost')
                    )
                    ->where('sale_date', '>=', $startDate)
                    ->groupBy('year', 'month')
                    ->orderBy('year')
                    ->orderBy('month')
                    ->get();

                // If we have real data, use it instead of sample data
                if (count($monthlySales) > 0) {
                    // Reset the profit margins to zero
                    foreach ($profitMargins as &$data) {
                        $data['margin'] = 0;
                    }

                    // Calculate profit margins from real data
                    foreach ($monthlySales as $sale) {
                        $index = $this->getMonthIndex($sale->year, $sale->month);
                        if ($index !== false && isset($profitMargins[$index])) {
                            $revenue = $sale->revenue;

                            // Find the corresponding cost
                            $cost = 0;
                            foreach ($productCosts as $productCost) {
                                if ($productCost->year == $sale->year && $productCost->month == $sale->month) {
                                    $cost = $productCost->cost;
                                    break;
                                }
                            }

                            // Calculate profit margin percentage
                            if ($revenue > 0) {
                                $profit = $revenue - $cost;
                                $margin = ($profit / $revenue) * 100;
                                $profitMargins[$index]['margin'] = round($margin, 1);
                            }
                        }
                    }
                }
            } catch (\Exception $e) {
                // If there's an error getting real data, we'll just use the sample data
            }
            */

            return response()->json([
                'success' => true,
                'data' => array_values($profitMargins)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve profit margin data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper function to get the index of a month in the data array
     * This method is currently not used as we're using sample data,
     * but it will be useful when we switch to real data.
     *
     * @param int $year
     * @param int $month
     * @return int|bool
     */
    private function getMonthIndex($year, $month)
    {
        $currentDate = Carbon::now();
        $targetDate = Carbon::createFromDate($year, $month, 1);

        // If the target date is in the future, return false
        if ($targetDate > $currentDate) {
            return false;
        }

        // Calculate how many months ago this was
        $monthsAgo = $currentDate->diffInMonths($targetDate);

        // If it's within the last 6 months, return the index
        if ($monthsAgo < 6) {
            $index = 5 - $monthsAgo;
            // Ensure the index is within the valid range (0-5)
            if ($index >= 0 && $index <= 5) {
                return $index;
            }
        }

        return false;
    }
}
