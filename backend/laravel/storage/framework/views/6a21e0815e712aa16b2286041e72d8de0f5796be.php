<?php $__env->startSection('title', __('Review & Checkout')); ?>

<?php $__env->startSection('content'); ?>
    <main class="bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 class="text-2xl font-extrabold py-8"><?php echo e(__('Review & Checkout')); ?></h1>
            <div class="flex flex-col gap-4 mb-4 -mt-4">
                <?php echo $__env->make('components.alert-success', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                <?php echo $__env->make('components.alert-danger', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
            </div>
            <div class="max-w-2xl pb-24 mx-auto lg:max-w-none">
                <div class="lg:grid lg:grid-cols-2 lg:gap-x-12">
                    <div>
                        <?php echo $__env->make('store.checkout.partials._customer_billing_info', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                    </div>
                    <!-- Order summary -->
                    <div class="rounded bg-white shadow-md border border-gray-100 mt-10 pb-4 lg:mt-0">
                        <div class="p-4 lg:p-6">
                            <?php echo $__env->make('store.checkout.partials._order_summary', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?>
                            <div class="mt-4">
                                <div class="flex flex-col mt-6">
                                    <button id="rzp-button" type="submit" class="mt-4 w-full bg-primary border border-transparent rounded-sm shadow-sm py-2 px-4 text-base font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-current">
                                        <?php echo e(__('Pay Now')); ?>

                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
<?php $__env->stopSection(); ?>
<?php $__env->startPush('scripts'); ?>
    
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    <script>
        var options = {
            "key": "<?php echo e($razorpay_key); ?>",
            "amount": "<?php echo e($order_total); ?>",
            "currency": "<?php echo e($order_currency); ?>",
            "order_id": "<?php echo e($order_id); ?>",
            "callback_url": "<?php echo e(route('razorpay_callback')); ?>",
            "prefill": {
                "name": "<?php echo e($billing_information['full_name']); ?>",
                "email": "<?php echo e($billing_information['email']); ?>",
                "phone": "<?php echo e($billing_information['phone']); ?>",
            },
        };
        var rzp = new Razorpay(options);
        document.getElementById('rzp-button').onclick = function(e){
            rzp.open();
            e.preventDefault();
        }
    </script>
<?php $__env->stopPush(); ?>

<?php echo $__env->make('store.layout', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /home/u209201537/domains/kidzstudio.net/public_html/resources/views/store/checkout/razorpay.blade.php ENDPATH**/ ?>