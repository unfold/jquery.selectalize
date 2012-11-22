/* Selectalize jQuery plugin by Simen Brekken (http://github.com/simenbrekken) */

(function($) {
    var Selectalizer = function(select, options) {
        this.$select = $(select);

        this.initialize(options || {});
    };

    Selectalizer.prototype.initialize = function(options) {
        var settings = {
            className: 'selectalizer'
        };

        $.extend(settings, options);

        if (!this.$container) {
            this.$placeholder = $('<span class="placeholder" />');
            this.$value = $('<span class="value" />');

            this.$title = $('<div class="title" />');
            this.$title.append(this.$placeholder, this.$value);
            this.$title.on('click.selectalizer', $.proxy(this.titleClick, this));

            this.$options = $('<ul class="options" />');
            this.$options.on('click.selectalizer .option:not(.selected)', $.proxy(this.optionClick, this));
            this.$options.on('click.selectalizer', false);

            this.$container = $('<div />').addClass(settings.className);
            this.$container.append(this.$title, this.$options).insertBefore(this.$select);

            this.$select.on('change.selectalizer', $.proxy(this.updateSelected, this));
            this.$select.hide();

            $(document).on('click.selectalizer', $.proxy(this.close, this));
        }

        var $options = this.$options.empty();

        this.$select.find('option').each(function() {
            $options.append($('<li />').text($(this).text()));
        });

        this.$placeholder.text(this.$select.attr('placeholder'));

        this.show();
        this.close();
        this.updateSelected();
    };

    Selectalizer.prototype.updateSelected = function(options) {
        var $selectedOption = this.$select.find('option:selected');
        var title = $selectedOption.text();

        this.$title.attr('title', title);
        this.$value.text(title);
        this.$options.children().eq($selectedOption.index()).addClass('selected').siblings().removeClass('selected');
    };

    Selectalizer.prototype.titleClick = function(e) {
        if (!this.$select.prop('disabled')) {
            e.stopPropagation();

            this.toggle();
        }
    };

    Selectalizer.prototype.optionClick = function(e) {
        this.select($(e.target).index());
        this.close();
    };

    Selectalizer.prototype.open = function() {
        this.$container.addClass('open');
        this.$select.trigger('open');
    };

    Selectalizer.prototype.close = function() {
        this.$container.removeClass('open');
        this.$select.trigger('close');
    };

    Selectalizer.prototype.select = function(value) {
        var previousOption = this.$select.find('option:selected').get(0);

        if (typeof value === 'number') {
            this.$select.find('option').eq(value).prop('selected', true);
        } else {
            this.$select.val(value);
        }

        var $selectedOption = this.$select.find('option:selected');

        if ($selectedOption.get(0) != previousOption) {
            this.$select.trigger('change');
        }

        return $selectedOption;
    };

    Selectalizer.prototype.toggle = function() {
        this.$container.hasClass('open') ? this.close() : this.open();
    };

    Selectalizer.prototype.show = function() {
        this.$container.show();
    };

    Selectalizer.prototype.hide = function() {
        this.$container.hide();
    };

    $.fn.selectalize = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var instance = $.data(this, 'selectalizer');

            if (typeof options === 'string' && typeof instance[options] === 'function') {
                instance[options].apply(instance, args);
            } else if (instance) {
                instance.initialize(options);
            } else {
                $.data(this, 'selectalizer', new Selectalizer(this, options));
            }
        });
    };
})(jQuery);
