<?php
/**
 * File name: ExamScheduleFilters.php
 * Last modified: 14/05/21, 1:37 PM
 * Author: NearCraft - https://codecanyon.net/user/nearcraft
 * Copyright (c) 2021
 */

namespace App\Filters;


class ExamScheduleFilters extends QueryFilter
{
    /*
    |--------------------------------------------------------------------------
    | DEFINE ALL COLUMN FILTERS BELOW
    |--------------------------------------------------------------------------
    */

    function status($query)
    {
        return $this->builder->where('status', $query);
    }

    function schedule_type($query)
    {
        return $this->builder->where('schedule_type', $query);
    }

    function date_from($query)
    {
        if($query) {
            return $this->builder->where(function($q) use ($query) {
                $q->whereDate('start_date', '>=', $query)
                  ->orWhereDate('end_date', '>=', $query);
            });
        }
        return null;
    }

    function date_to($query)
    {
        if($query) {
            return $this->builder->where(function($q) use ($query) {
                $q->whereDate('end_date', '<=', $query)
                  ->orWhereDate('start_date', '<=', $query);
            });
        }
        return null;
    }
}
